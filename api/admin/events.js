const { neon } = require("@neondatabase/serverless");
const { getAdminSession } = require("../../lib/adminAuth");

function validTime(value) {
	return typeof value === "string" && /^\d{2}:\d{2}$/.test(value);
}

async function purgeExpired(sql) {
	await sql`
		DELETE FROM schedule_events
		WHERE (event_date + end_time + INTERVAL '1 day') < (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Bangkok')
	`;
}

module.exports = async function handler(req, res) {
	const session = getAdminSession(req);
	if(!session) return res.status(401).json({ error: "Not authenticated" });
	if(!process.env.DATABASE_URL) return res.status(500).json({ error: "Database is not configured" });

	const sql = neon(process.env.DATABASE_URL);

	try {
		await purgeExpired(sql);

		if(req.method === "GET") {
			const events = await sql`
				SELECT id, title, details,
					event_date::text AS event_date,
					start_time::text AS start_time,
					end_time::text AS end_time,
					created_at
				FROM schedule_events
				WHERE event_date >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Bangkok')::date
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
				RETURNING id, title, details,
					event_date::text AS event_date,
					start_time::text AS start_time,
					end_time::text AS end_time,
					created_at
			`;

			return res.status(201).json({ event: rows[0] });
		}

		if(req.method === "PUT") {
			const id = Number(req.query?.id);
			const title = req.body?.title?.trim();
			const details = req.body?.details?.trim() || "";
			const eventDate = req.body?.eventDate;
			const startTime = req.body?.startTime;
			const endTime = req.body?.endTime;

			if(!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid event id" });
			if(!title || typeof eventDate !== "string" || !validTime(startTime) || !validTime(endTime)) {
				return res.status(400).json({ error: "Title, date, start time and end time are required" });
			}
			if(!/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) return res.status(400).json({ error: "Invalid date" });
			if(startTime >= endTime) return res.status(400).json({ error: "Ending time must be after starting time" });
			if(title.length > 120 || details.length > 1000) return res.status(400).json({ error: "Event is too long" });

			const rows = await sql`
				UPDATE schedule_events
				SET title = ${title}, details = ${details}, event_date = ${eventDate}, start_time = ${startTime}, end_time = ${endTime}
				WHERE id = ${id}
				RETURNING id, title, details,
					event_date::text AS event_date,
					start_time::text AS start_time,
					end_time::text AS end_time,
					created_at
			`;

			if(rows.length === 0) return res.status(404).json({ error: "Event not found" });
			return res.status(200).json({ event: rows[0] });
		}

		if(req.method === "DELETE") {
			const id = Number(req.query?.id);
			if(!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid event id" });

			await sql`DELETE FROM schedule_events WHERE id = ${id}`;
			return res.status(200).json({ ok: true });
		}

		res.setHeader("Allow", "GET, POST, PUT, DELETE");
		return res.status(405).json({ error: "Method not allowed" });
	}
	catch(error) {
		console.error(error);
		return res.status(500).json({ error: "Database error" });
	}
};
