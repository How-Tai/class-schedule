const { neon } = require("@neondatabase/serverless");
const { getAdminSession } = require("../../lib/adminAuth");

function validTime(value) {
	return typeof value === "string" && /^\d{2}:\d{2}$/.test(value);
}

module.exports = async function handler(req, res) {
	const session = getAdminSession(req);
	if(!session) return res.status(401).json({ error: "Not authenticated" });
	if(!process.env.DATABASE_URL) return res.status(500).json({ error: "Database is not configured" });

	const sql = neon(process.env.DATABASE_URL);

	try {
		if(req.method === "GET") {
			const events = await sql`
				SELECT id, title, details, event_date, start_time, end_time, created_at
				FROM schedule_events
				WHERE event_date >= CURRENT_DATE
				ORDER BY event_date, start_time, created_at
			`;

			return res.status(200).json({ events });
		}

		if(req.method === "POST") {
			const title = req.body?.title?.trim();
			const details = req.body?.details?.trim() || "";
			const eventDate = req.body?.eventDate;
			const startTime = req.body?.startTime;
			const endTime = req.body?.endTime;

			if(!title || typeof eventDate !== "string" || !validTime(startTime) || !validTime(endTime)) {
				return res.status(400).json({ error: "Title, date, start time and end time are required" });
			}

			if(!/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) return res.status(400).json({ error: "Invalid date" });
			if(startTime >= endTime) return res.status(400).json({ error: "Ending time must be after starting time" });
			if(title.length > 120 || details.length > 1000) return res.status(400).json({ error: "Event is too long" });

			const rows = await sql`
				INSERT INTO schedule_events (title, details, event_date, start_time, end_time, created_by)
				VALUES (${title}, ${details}, ${eventDate}, ${startTime}, ${endTime}, ${session.id})
				RETURNING id, title, details, event_date, start_time, end_time, created_at
			`;

			return res.status(201).json({ event: rows[0] });
		}

		if(req.method === "DELETE") {
			const id = Number(req.query?.id);
			if(!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid event id" });

			await sql`DELETE FROM schedule_events WHERE id = ${id}`;
			return res.status(200).json({ ok: true });
		}

		res.setHeader("Allow", "GET, POST, DELETE");
		return res.status(405).json({ error: "Method not allowed" });
	}
	catch(error) {
		console.error(error);
		return res.status(500).json({ error: "Database error" });
	}
};
