const { neon } = require("@neondatabase/serverless");

module.exports = async function handler(req, res) {
	if(req.method !== "GET") {
		res.setHeader("Allow", "GET");
		return res.status(405).json({ error: "Method not allowed" });
	}

	if(!process.env.DATABASE_URL) {
		return res.status(500).json({ error: "Database is not configured" });
	}

	try {
		const sql = neon(process.env.DATABASE_URL);

		await sql`
			DELETE FROM schedule_events
			WHERE (event_date + end_time + INTERVAL '5 minutes') < (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Bangkok')
		`;

		const announcements = await sql`
			SELECT id, title, message, created_at
			FROM announcements
			ORDER BY created_at DESC
			LIMIT 20
		`;

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

		res.setHeader("Cache-Control", "no-store");
		return res.status(200).json({ announcements, events });
	}
	catch(error) {
		console.error(error);
		return res.status(500).json({ error: "Database error" });
	}
};
