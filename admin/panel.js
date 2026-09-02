let session = null;

async function api(url, options = {}) {
	const res = await fetch(url, {
		credentials: "include",
		...options,
		headers: {
			"Content-Type": "application/json",
			...(options.headers || {})
		}
	});

	let data = {};
	try {
		data = await res.json();
	}
	catch {}

	if(res.status === 401) {
		window.location.href = "/admin/login.html";
		throw new Error("Not authenticated");
	}

	if(!res.ok) throw new Error(data.error || "Request failed");
	return data;
}

function bangkokNow() {
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Bangkok",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	}).formatToParts(new Date());

	const values = {};
	for(const part of parts) values[part.type] = part.value;

	return {
		date: `${values.year}-${values.month}-${values.day}`,
		time: `${values.hour}:${values.minute}`
	};
}

function normalizeDate(value) {
	if(typeof value === "string") return value.slice(0, 10);
	return String(value).slice(0, 10);
}

function normalizeTime(value) {
	return String(value).slice(0, 5);
}

function eventStatus(event) {
	const now = bangkokNow();
	const date = normalizeDate(event.event_date);
	const start = normalizeTime(event.start_time);
	const end = normalizeTime(event.end_time);

	if(date === now.date && start <= now.time && now.time < end) return "In action";
	if(date < now.date || (date === now.date && end <= now.time)) return "Ended";
	return "Scheduled";
}

function formatDate(date) {
	const [year, month, day] = normalizeDate(date).split("-");
	return `${day}/${month}/${year}`;
}

function escapeText(value) {
	return String(value ?? "");
}

async function loadSession() {
	const data = await api("/api/admin/session", { method: "GET" });
	session = data;

	document.getElementById("welcome").textContent = `Logged in as ${data.username}`;
	document.getElementById("role").textContent = data.role;
	if(data.role === "owner") document.getElementById("hash-link").hidden = false;
}

async function loadAnnouncements() {
	const data = await api("/api/admin/announcements", { method: "GET" });
	const list = document.getElementById("announcement-list");
	list.innerHTML = "";

	if(data.announcements.length === 0) {
		list.innerHTML = '<p class="empty">No announcements.</p>';
		return;
	}

	for(const item of data.announcements) {
		const card = document.createElement("article");
		card.className = "item-card";

		const content = document.createElement("div");
		const title = document.createElement("h3");
		const message = document.createElement("p");
		const meta = document.createElement("small");
		const del = document.createElement("button");

		title.textContent = escapeText(item.title);
		message.textContent = escapeText(item.message);
		meta.textContent = new Date(item.created_at).toLocaleString("en-GB", { timeZone: "Asia/Bangkok" });
		del.textContent = "Delete";
		del.className = "danger";
		del.type = "button";
		del.addEventListener("click", () => deleteAnnouncement(item.id));

		content.append(title, message, meta);
		card.append(content, del);
		list.appendChild(card);
	}
}

async function loadEvents() {
	const data = await api("/api/admin/events", { method: "GET" });
	const list = document.getElementById("event-list");
	list.innerHTML = "";

	const visible = data.events.filter(event => eventStatus(event) !== "Ended");

	if(visible.length === 0) {
		list.innerHTML = '<p class="empty">No active or upcoming overrides.</p>';
		return;
	}

	for(const event of visible) {
		const card = document.createElement("article");
		card.className = "item-card";

		const content = document.createElement("div");
		const heading = document.createElement("div");
		const title = document.createElement("h3");
		const badge = document.createElement("span");
		const details = document.createElement("p");
		const meta = document.createElement("small");
		const del = document.createElement("button");

		const status = eventStatus(event);
		title.textContent = escapeText(event.title);
		badge.textContent = status;
		badge.className = status === "In action" ? "badge live" : "badge";
		heading.className = "item-heading";
		heading.append(title, badge);

		details.textContent = event.details || "No additional details";
		meta.textContent = `${formatDate(event.event_date)} • ${normalizeTime(event.start_time)}–${normalizeTime(event.end_time)}`;
		del.textContent = "Delete";
		del.className = "danger";
		del.type = "button";
		del.addEventListener("click", () => deleteEvent(event.id));

		content.append(heading, details, meta);
		card.append(content, del);
		list.appendChild(card);
	}
}

async function deleteAnnouncement(id) {
	if(!confirm("Delete this announcement?")) return;
	try {
		await api(`/api/admin/announcements?id=${id}`, { method: "DELETE" });
		await loadAnnouncements();
	}
	catch(error) {
		showMessage(error.message, true);
	}
}

async function deleteEvent(id) {
	if(!confirm("Delete this schedule override?")) return;
	try {
		await api(`/api/admin/events?id=${id}`, { method: "DELETE" });
		await loadEvents();
	}
	catch(error) {
		showMessage(error.message, true);
	}
}

function showMessage(message, error = false) {
	const box = document.getElementById("message");
	box.textContent = message;
	box.className = error ? "message error" : "message success";
	box.hidden = false;
	setTimeout(() => box.hidden = true, 4000);
}

document.getElementById("announcement-form").addEventListener("submit", async (event) => {
	event.preventDefault();

	const title = document.getElementById("announcement-title").value.trim();
	const message = document.getElementById("announcement-message").value.trim();

	try {
		await api("/api/admin/announcements", {
			method: "POST",
			body: JSON.stringify({ title, message })
		});

		event.target.reset();
		showMessage("Announcement published.");
		await loadAnnouncements();
	}
	catch(error) {
		showMessage(error.message, true);
	}
});

document.getElementById("event-form").addEventListener("submit", async (event) => {
	event.preventDefault();

	const title = document.getElementById("event-title").value.trim();
	const details = document.getElementById("event-details").value.trim();
	const eventDate = document.getElementById("event-date").value;
	const startTime = document.getElementById("event-start").value;
	const endTime = document.getElementById("event-end").value;

	try {
		await api("/api/admin/events", {
			method: "POST",
			body: JSON.stringify({ title, details, eventDate, startTime, endTime })
		});

		event.target.reset();
		document.getElementById("event-date").value = bangkokNow().date;
		showMessage("Schedule override created.");
		await loadEvents();
	}
	catch(error) {
		showMessage(error.message, true);
	}
});

document.getElementById("logout").addEventListener("click", async () => {
	await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
	window.location.href = "/admin/login.html";
});

async function init() {
	try {
		await loadSession();
		document.getElementById("event-date").value = bangkokNow().date;
		await Promise.all([loadAnnouncements(), loadEvents()]);
		document.getElementById("loading").hidden = true;
		document.getElementById("admin").hidden = false;
	}
	catch(error) {
		console.error(error);
	}
}

init();
setInterval(() => loadEvents().catch(() => {}), 30000);
