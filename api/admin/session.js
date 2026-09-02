const crypto = require("crypto");

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

module.exports = function handler(req, res) {
	if(req.method !== "GET") {
		res.setHeader("Allow", "GET");
		return res.status(405).json({ error: "Method not allowed" });
	}

	const sessionSecret = process.env.SESSION_SECRET;
	if(!sessionSecret) return res.status(500).json({ error: "Session is not configured" });

	const token = getCookie(req, "admin_session");
	if(!token) return res.status(401).json({ authenticated: false });

	const parts = token.split(".");
	if(parts.length !== 2) return res.status(401).json({ authenticated: false });

	const [payload, signature] = parts;
	const expected = sign(payload, sessionSecret);
	if(!safeEqual(signature, expected)) return res.status(401).json({ authenticated: false });

	try {
		const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
		if(!data.exp || Date.now() > data.exp) return res.status(401).json({ authenticated: false });
		return res.status(200).json({
			authenticated: true,
			id: data.id,
			username: data.username,
			role: data.role
		});
	}
	catch {
		return res.status(401).json({ authenticated: false });
	}
};
