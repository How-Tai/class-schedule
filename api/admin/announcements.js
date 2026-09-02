const { neon } = require("@neondatabase/serverless");
const { getAdminSession } = require("../../lib/adminAuth");

module.exports = async function handler(req, res) {
	const session = getAdminSession(req);
	if(!session) return res.status(401).json({ error: "Not authenticated" });
	if(!process.env.DATABASE_URL) return res.status(500).json({ error: "Database is not configured" });

	const sql = neon(process.env.DATABASE_URL);

	try {
		if(req.method === "GET") {
			const announcements = await sql`
				SELECT id, title, message, created_at
				FROM announcements
				ORDER BY created_at DESC
				LIMIT 20
			`;

			return res.status(200).json({ announcements });
		}

		if(req.method === "POST") {
			const title = req.body?.title?.trim();
			const message = req.body?.message?.trim();

			if(!title || !message) return res.status(400).json({ error: "Title and message are required" });
			if(title.length > 120 || message.length > 2000) return res.status(400).json({ error: "Announcement is too long" });

			const countRows = await sql`SELECT COUNT(*)::int AS count FROM announcements`;
			if(countRows[0].count >= 20) return res.status(409).json({ error: "Announcement limit reached. Delete one before adding another." });

			const rows = await sql`
				INSERT INTO announcements (title, message, created_by)
				VALUES (${title}, ${message}, ${session.id})
				RETURNING id, title, message, created_at
			`;

			return res.status(201).json({ announcement: rows[0] });
		}

		if(req.method === "DELETE") {
			const id = Number(req.query?.id);
			if(!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid announcement id" });

			await sql`DELETE FROM announcements WHERE id = ${id}`;
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
