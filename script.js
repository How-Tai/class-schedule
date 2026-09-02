let schedule = [
	{ subject: "Computer Science", teacher: "Mr. Santos", room: "754", day: "Monday", start: "08:30", end: "09:25" },
	{ subject: "Mathematics", teacher: "Mr. Verona", room: "1024", day: "Monday", start: "09:25", end: "10:20" },
	{ subject: "Civics, Culture and Life in Society", teacher: "Mr. Zhang", room: "1024", day: "Monday", start: "10:20", end: "11:15" },
	{ subject: "Lunch", teacher: "none", room: "1024", day: "Monday", start: "11:15", end: "12:10" },
	{ subject: "Religion", teacher: "Mr. Mathis", room: "1024", day: "Monday", start: "12:10", end: "13:05" },
	{ subject: "Geography", teacher: "Mr. Retter", room: "1024", day: "Monday", start: "13:05", end: "14:00" },
	{ subject: "STEM", teacher: "Mr. Krapf & Mr. Verona", room: "1027", day: "Monday", start: "14:00", end: "14:55" },
	{ subject: "Thai", teacher: "Ms. Kittinapa", room: "1024", day: "Monday", start: "14:55", end: "15:50" },

	{ subject: "Mathematics", teacher: "Mr. Verona", room: "1024", day: "Tuesday", start: "08:30", end: "09:25" },
	{ subject: "English", teacher: "Ms. Douglass", room: "1024", day: "Tuesday", start: "09:25", end: "10:20" },
	{ subject: "English Listening-Speaking", teacher: "Mr. Mathis", room: "1024", day: "Tuesday", start: "10:20", end: "11:15" },
	{ subject: "Lunch", teacher: "none", room: "1024", day: "Tuesday", start: "11:15", end: "12:10" },
	{ subject: "Science", teacher: "Mr. Krapf", room: "1024", day: "Tuesday", start: "12:10", end: "13:05" },
	{ subject: "English Writing", teacher: "Mr. Grudge", room: "1024", day: "Tuesday", start: "13:05", end: "14:00" },
	{ subject: "Assembly", teacher: "Mr. Surachet & Mr. Aekkalak", room: "1024", day: "Tuesday", start: "14:00", end: "14:55" },
	{ subject: "Physical Education", teacher: "Mr. Spicer", room: "Gym", day: "Tuesday", start: "14:55", end: "15:50" },

	{ subject: "Mathematics", teacher: "Mr. Verona", room: "1024", day: "Wednesday", start: "08:30", end: "09:25" },
	{ subject: "Thai", teacher: "Ms. Kittinapa", room: "1024", day: "Wednesday", start: "09:25", end: "10:20" },
	{ subject: "Add. Science", teacher: "Mr. Krapf", room: "1024", day: "Wednesday", start: "10:20", end: "11:15" },
	{ subject: "Lunch", teacher: "none", room: "1024", day: "Wednesday", start: "11:15", end: "12:10" },
	{ subject: "English", teacher: "Ms. Douglass", room: "1024", day: "Wednesday", start: "12:10", end: "13:05" },
	{ subject: "Visual Art", teacher: "Mr. Tagle", room: "1041", day: "Wednesday", start: "13:05", end: "14:00" },
	{ subject: "Scouts", teacher: "I couldn't care to find who", room: "1024", day: "Wednesday", start: "14:00", end: "14:55" },
	{ subject: "Research & Knowledge", teacher: "Mr. Mathis", room: "1024", day: "Wednesday", start: "14:55", end: "15:50" },

	{ subject: "Occupation", teacher: "Ms. Pillay", room: "1024", day: "Thursday", start: "08:30", end: "09:25" },
	{ subject: "English Reading-Writing", teacher: "Mr. Keating", room: "1024", day: "Thursday", start: "09:25", end: "10:20" },
	{ subject: "Add. Science", teacher: "Mr. Krapf", room: "1024", day: "Thursday", start: "10:20", end: "11:15" },
	{ subject: "Lunch", teacher: "none", room: "1024", day: "Thursday", start: "11:15", end: "12:10" },
	{ subject: "Add. Math.", teacher: "Mr. Verona", room: "1024", day: "Thursday", start: "12:10", end: "13:05" },
	{ subject: "Health Education", teacher: "Mr. Edwards", room: "1024", day: "Thursday", start: "13:05", end: "14:00" },
	{ subject: "Geography", teacher: "Mr. Retter", room: "1024", day: "Thursday", start: "14:00", end: "14:55" },
	{ subject: "Guidance", teacher: "Mr. Mathis", room: "1024", day: "Thursday", start: "14:55", end: "15:50" },

	{ subject: "English", teacher: "Ms. Douglass", room: "1024", day: "Friday", start: "08:30", end: "09:25" },
	{ subject: "Visual Art", teacher: "Mr. Tagle", room: "1041", day: "Friday", start: "09:25", end: "10:20" },
	{ subject: "Add. Math.", teacher: "Mr. Verona", room: "1024", day: "Friday", start: "10:20", end: "11:15" },
	{ subject: "Lunch", teacher: "none", room: "1024", day: "Friday", start: "11:15", end: "12:10" },
	{ subject: "Science", teacher: "Mr. Krapf", room: "1024", day: "Friday", start: "12:10", end: "14:00" },
	{ subject: "Research & Knowledge", teacher: "Mr. Mathis", room: "1024", day: "Friday", start: "14:00", end: "14:55" },
	{ subject: "Thai", teacher: "Ms. Kittinapa", room: "1024", day: "Friday", start: "14:55", end: "15:50" }
];

let liveEvents = [];
let announcements = [];
let liveAvailable = false;
let showMilliseconds = localStorage.getItem("showMilliseconds") === "true";
let displaySchedule = localStorage.getItem("displaySchedule") === "true";

document.getElementById("showMilliseconds").checked = showMilliseconds;
document.getElementById("displaySchedule").checked = displaySchedule;

function toggleMilliseconds() {
	showMilliseconds = document.getElementById("showMilliseconds").checked;
	localStorage.setItem("showMilliseconds", showMilliseconds);
	updateDisplay();
}

function toggleDisplaySchedule() {
	displaySchedule = document.getElementById("displaySchedule").checked;
	localStorage.setItem("displaySchedule", displaySchedule);
	updateDisplay();
}

function getNowInfo() {
	const now = new Date();
	const formatter = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Bangkok",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		weekday: "long",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hourCycle: "h23"
	});

	const values = {};
	for(const part of formatter.formatToParts(now)) values[part.type] = part.value;

	return {
		day: values.weekday,
		date: `${values.year}-${values.month}-${values.day}`,
		time: `${values.hour}:${values.minute}`,
		seconds: values.second,
		milliseconds: now.getMilliseconds()
	};
}

function normalizeDate(value) {
	return String(value).slice(0, 10);
}

function normalizeTime(value) {
	return String(value).slice(0, 5);
}

function getActiveEvents() {
	const { date, time } = getNowInfo();

	return liveEvents.filter(event => {
		const eventDate = normalizeDate(event.event_date);
		const start = normalizeTime(event.start_time);
		const end = normalizeTime(event.end_time);
		return eventDate === date && start <= time && time < end;
	});
}

function getUpcomingEventsToday() {
	const { date, time } = getNowInfo();

	return liveEvents
		.filter(event => normalizeDate(event.event_date) === date && normalizeTime(event.start_time) > time)
		.sort((a, b) => normalizeTime(a.start_time).localeCompare(normalizeTime(b.start_time)));
}

function getCurrentClass() {
	const { day, time } = getNowInfo();
	return schedule.find(c => c.day === day && c.start <= time && time < c.end);
}

function getNextClass() {
	const { day, time } = getNowInfo();
	return schedule
		.filter(c => c.day === day && c.start > time)
		.sort((a, b) => a.start.localeCompare(b.start))[0];
}

function renderAnnouncements() {
	const section = document.getElementById("announcements");
	const list = document.getElementById("announcement-list");
	list.innerHTML = "";

	if(announcements.length === 0) {
		section.hidden = true;
		return;
	}

	section.hidden = false;

	for(const announcement of announcements) {
		const card = document.createElement("article");
		card.className = "announcement-card";

		const title = document.createElement("h3");
		const message = document.createElement("p");
		title.textContent = announcement.title;
		message.textContent = announcement.message;

		card.append(title, message);
		list.appendChild(card);
	}
}

function renderActiveEvents(events) {
	const section = document.getElementById("live-events");
	const list = document.getElementById("live-event-list");
	list.innerHTML = "";

	if(events.length === 0) {
		section.hidden = true;
		return;
	}

	section.hidden = false;

	for(const event of events) {
		const card = document.createElement("article");
		card.className = "live-event-card";

		const title = document.createElement("h3");
		const time = document.createElement("p");
		const details = document.createElement("p");

		title.textContent = event.title;
		time.className = "live-event-time";
		time.textContent = `${normalizeTime(event.start_time)}–${normalizeTime(event.end_time)}`;
		details.textContent = event.details || "";

		card.append(title, time);
		if(event.details) card.appendChild(details);
		list.appendChild(card);
	}
}

function updateDisplay() {
	const { day, time, seconds, milliseconds } = getNowInfo();
	const activeEvents = getActiveEvents();
	const current = getCurrentClass();
	const nextClass = getNextClass();
	const upcomingEvents = getUpcomingEventsToday();

	document.getElementById("dayTime").textContent = `${day} ${time}:${seconds}`;
	if(showMilliseconds) document.getElementById("dayTime").textContent += `:${milliseconds.toString().padStart(3, "0")}`;

	renderActiveEvents(activeEvents);

	if(activeEvents.length > 0) {
		document.getElementById("current").textContent = activeEvents.length === 1
			? `Current: ${activeEvents[0].title}`
			: `Current: ${activeEvents.length} schedule overrides in action`;
	}
	else {
		document.getElementById("current").textContent = current
			? `Current: ${current.subject} | ${current.teacher} | Room ${current.room}`
			: "Current: No class";
	}

	const nextEvent = upcomingEvents[0];
	const nextEventTime = nextEvent ? normalizeTime(nextEvent.start_time) : null;

	if(nextEvent && (!nextClass || nextEventTime <= nextClass.start)) {
		const sameTimeEvents = upcomingEvents.filter(event => normalizeTime(event.start_time) === nextEventTime);
		const names = sameTimeEvents.map(event => event.title).join(" + ");
		document.getElementById("next").textContent = `Next: ${names} at ${nextEventTime}`;
	}
	else {
		document.getElementById("next").textContent = nextClass
			? `Next: ${nextClass.subject} at ${nextClass.start} | ${nextClass.teacher} | Room ${nextClass.room}`
			: "Next: No more classes today";
	}

	document.getElementById("schedule").style.display = displaySchedule ? "block" : "none";
	document.getElementById("live-status").textContent = liveAvailable
		? "Live schedule connected"
		: "Using schedule stored in the site";
}

async function loadLiveData() {
	try {
		const res = await fetch("/api/public/live", { cache: "no-store" });
		if(!res.ok) throw new Error("Live schedule unavailable");

		const data = await res.json();
		liveEvents = Array.isArray(data.events) ? data.events : [];
		announcements = Array.isArray(data.announcements) ? data.announcements : [];
		liveAvailable = true;
		renderAnnouncements();
		updateDisplay();
	}
	catch(error) {
		liveEvents = [];
		announcements = [];
		liveAvailable = false;
		renderAnnouncements();
		updateDisplay();
	}
}

setInterval(updateDisplay, 100);
setInterval(loadLiveData, 30000);
updateDisplay();
loadLiveData();
