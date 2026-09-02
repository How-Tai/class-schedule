CREATE TABLE IF NOT EXISTS announcements (
	id SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	message TEXT NOT NULL,
	created_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS schedule_events (
	id SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	details TEXT NOT NULL DEFAULT '',
	event_date DATE NOT NULL,
	start_time TIME NOT NULL,
	end_time TIME NOT NULL,
	created_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT schedule_events_valid_time CHECK (start_time < end_time)
);

CREATE INDEX IF NOT EXISTS schedule_events_date_time_idx
ON schedule_events (event_date, start_time, end_time);
