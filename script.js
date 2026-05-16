let schedule = [
  { subject: "Computer Science", teacher: "Mr. Santos", room: "1024", day: "Monday", start: "08:30", end: "09:25" },
  { subject: "Mathematics", teacher: "Mr. Verona", room: "1024", day: "Monday", start: "09:25", end: "10:20" },
  { subject: "Civics, Culture and Life in Society", teacher: "Mr. Zhang", room: "1024", day: "Monday", start: "10:20", end: "11:15" },
  { subject: "Lunch", teacher: "none", room: "1024", day: "Monday", start: "11:15", end: "12:10" },
  { subject: "Geography", teacher: "Mr. Retter", room: "1024", day: "Monday", start: "12:10", end: "13:05" },
  { subject: "Religion", teacher: "Mr. Mathis", room: "1024", day: "Monday", start: "13:05", end: "14:00" },
  { subject: "STEM", teacher: "Mr. Krapf & Mr. Verona", room: "1027", day: "Monday", start: "14:00", end: "14:55" },
  { subject: "Thai", teacher: "Ms. Kittinapa", room: "1024", day: "Monday", start: "14:55", end: "15:50" },

  { subject: "Mathematics", teacher: "Mr. Verona", room: "1024", day: "Tuesday", start: "08:30", end: "09:25" },
  { subject: "English", teacher: "Ms. Douglass", room: "1024", day: "Tuesday", start: "09:25", end: "10:20" },
  { subject: "English Listening-Speaking", teacher: "Mr. Mathis", room: "1024", day: "Tuesday", start: "10:20", end: "11:15" },
  { subject: "Lunch", teacher: "none", room: "1024", day: "Tuesday", start: "11:15", end: "12:10" },
  { subject: "Science", teacher: "Mr. Krapf", room: "1024", day: "Tuesday", start: "12:10", end: "13:05" },
  { subject: "English Writing", teacher: "Mr. Grudge", room: "1024", day: "Tuesday", start: "13:05", end: "14:00" },
  { subject: "Assembly", teacher: "I don't know", room: "1024", day: "Tuesday", start: "14:00", end: "14:55" },
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
  let now = new Date();

  let formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Bangkok",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  });

  let parts = formatter.formatToParts(now);

  let values = {};
  for (let part of parts) {
    values[part.type] = part.value;
  }

  return {
    day: values.weekday,
    time: `${values.hour}:${values.minute}`,
    seconds: values.second,
    milliseconds: now.getMilliseconds()
  };
}

function getCurrentClass() {
  let { day, time, seconds, milliseconds } = getNowInfo();

  return schedule.find(c =>
    c.day === day &&
    c.start <= time &&
    time < c.end
  );
}

function getNextClass() {
  let { day, time, seconds, milliseconds } = getNowInfo();
  return schedule
    .filter(c => c.day === day && c.start > time)
    .sort((a, b) => a.start.localeCompare(b.start))[0];
}

function updateDisplay() {
  let { day, time, seconds, milliseconds } = getNowInfo();
  let current = getCurrentClass();
  let next = getNextClass();

  document.getElementById("dayTime").textContent = `${day} ${time}:${seconds}`;
  if(showMilliseconds) document.getElementById("dayTime").textContent += `:${milliseconds.toString().padStart(3, "0")}`;

  document.getElementById("current").textContent = current
    ? `Current: ${current.subject} | ${current.teacher} | Room ${current.room}`
    : "Current: No class";

  document.getElementById("next").textContent = next
    ? `Next: ${next.subject} at ${next.start} | ${next.teacher} | Room ${next.room}`
    : "Next: No more classes today";

    if(displaySchedule) {
      document.getElementById("schedule").style.display = "block";
    } else {
      document.getElementById("schedule").style.display = "none";
    }
}

setInterval(updateDisplay, 1);
updateDisplay();