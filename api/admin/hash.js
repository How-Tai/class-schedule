const crypto = require("crypto");
const bcrypt = require("bcryptjs");

function sign(value, secret) {
	return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(a, b) {
	const x = Buffer.from(String(a));
	const y = Buffer.from(String(b));
	if(x.length !== y.length) return false;
	return crypto.timingSafeEqual(x, y);
}

function getCookie(req, name) {
	const cookies = req.headers.cookie || "";

	for(const part of cookies.split(";")) {
		const [key, ...rest] = part.trim().split("=");
		if(key === name) return rest.join("=");
	}

	return null;
}

function getSession(req, sessionSecret) {
	const token = getCookie(req, "admin_session");
	if(!token) return null;

	const parts = token.split(".");
	if(parts.length !== 2) return null;

	const [payload, signature] = parts;
	const expected = sign(payload, sessionSecret);

	if(!safeEqual(signature, expected)) return null;

	try {
		const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
		if(!data.exp || Date.now() > data.exp) return null;
		return data;
	}
	catch {
		return null;
	}
}

module.exports = async function handler(req, res) {
	if(req.method !== "POST") {
		res.setHeader("Allow", "POST");
		return res.status(405).json({ error: "Method not allowed" });
	}

	const sessionSecret = process.env.SESSION_SECRET;
	if(!sessionSecret) return res.status(500).json({ error: "Session is not configured" });

	const session = getSession(req, sessionSecret);
	if(!session) return res.status(401).json({ error: "Not authenticated" });
	if(session.role !== "owner") return res.status(403).json({ error: "Owner access required" });

	const password = req.body?.password;

	if(typeof password !== "string" || password.length === 0) {
		return res.status(400).json({ error: "Password is required" });
	}

	if(password.length > 256) {
		return res.status(400).json({ error: "Password is too long" });
	}

	try {
		const hash = await bcrypt.hash(password, 12);
		return res.status(200).json({ hash });
	}
	catch {
		return res.status(500).json({ error: "Could not hash password" });
	}
};
