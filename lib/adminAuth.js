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

function getAdminSession(req) {
	const sessionSecret = process.env.SESSION_SECRET;
	if(!sessionSecret) return null;

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

module.exports = { getAdminSession };
