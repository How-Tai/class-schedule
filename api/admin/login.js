const crypto = require("crypto");
const { neon } = require("@neondatabase/serverless");
const bcrypt = require("bcryptjs");

function sign(value, secret) {
	return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

module.exports = async function handler(req, res) {
	if(req.method !== "POST") {
		res.setHeader("Allow", "POST");
		return res.status(405).json({ error: "Method not allowed" });
	}

	const databaseUrl = process.env.DATABASE_URL;
	const sessionSecret = process.env.SESSION_SECRET;

	if(!databaseUrl || !sessionSecret) {
		return res.status(500).json({ error: "Admin login is not configured" });
	}

	const username = req.body?.username;
	const password = req.body?.password;

	if(typeof username !== "string" || typeof password !== "string" || !username || !password) {
		return res.status(400).json({ error: "Username and password are required" });
	}

	try {
		const sql = neon(databaseUrl);
		const admins = await sql`
			SELECT id, username, password_hash, role
			FROM admins
			WHERE username = ${username}
			LIMIT 1
		`;

		if(admins.length === 0) {
			return res.status(401).json({ error: "Invalid username or password" });
		}

		const admin = admins[0];
		const passwordMatches = await bcrypt.compare(password, admin.password_hash);

		if(!passwordMatches) {
			return res.status(401).json({ error: "Invalid username or password" });
		}

		const payload = Buffer.from(JSON.stringify({
			id: admin.id,
			username: admin.username,
			role: admin.role,
			exp: Date.now() + 8 * 60 * 60 * 1000
		})).toString("base64url");

		const signature = sign(payload, sessionSecret);
		const token = `${payload}.${signature}`;

		res.setHeader("Set-Cookie", `admin_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${8 * 60 * 60}`);
		return res.status(200).json({ ok: true, username: admin.username, role: admin.role });
	}
	catch(error) {
		console.error(error);
		return res.status(500).json({ error: "Database error" });
	}
};
