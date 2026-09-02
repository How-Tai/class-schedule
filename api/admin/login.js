const crypto = require("crypto");

function safeEqual(a, b) {
	const x = Buffer.from(String(a));
	const y = Buffer.from(String(b));
	if(x.length !== y.length) return false;
	return crypto.timingSafeEqual(x, y);
}

function sign(value, secret) {
	return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

module.exports = function handler(req, res) {
	if(req.method !== "POST") {
		res.setHeader("Allow", "POST");
		return res.status(405).json({ error: "Method not allowed" });
	}

	const adminUsername = process.env.ADMIN_USERNAME;
	const adminPassword = process.env.ADMIN_PASSWORD;
	const sessionSecret = process.env.SESSION_SECRET;

	if(!adminUsername || !adminPassword || !sessionSecret) {
		return res.status(500).json({ error: "Admin login is not configured" });
	}

	let username;
	let password;

	if(typeof req.body === "string") {
		const body = new URLSearchParams(req.body);
		username = body.get("username");
		password = body.get("password");
	}
	else {
		username = req.body?.username;
		password = req.body?.password;
	}

	if(!safeEqual(username ?? "", adminUsername) || !safeEqual(password ?? "", adminPassword)) {
		return res.status(401).json({ error: "Invalid username or password" });
	}

	const payload = Buffer.from(JSON.stringify({
		username: adminUsername,
		exp: Date.now() + 8 * 60 * 60 * 1000
	})).toString("base64url");

	const signature = sign(payload, sessionSecret);
	const token = `${payload}.${signature}`;

	res.setHeader("Set-Cookie", `admin_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${8 * 60 * 60}`);
	return res.status(200).json({ ok: true });
};
