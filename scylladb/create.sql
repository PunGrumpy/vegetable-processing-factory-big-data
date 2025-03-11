-- Factories Table
CREATE TABLE factories (
    factory_id TEXT PRIMARY KEY,
    name TEXT,
    location TEXT
);

-- Sensors Table
CREATE TABLE sensors (
    sensor_id TEXT PRIMARY KEY,
    type TEXT,
    location TEXT,
    unit TEXT,
    threshold_min INT,
    threshold_max INT
);

-- Sensor Data (Time-Series)
CREATE TABLE sensor_data (
    sensor_id TEXT,
    timestamp TIMESTAMP,
    value FLOAT,
    PRIMARY KEY (sensor_id, timestamp)
) WITH CLUSTERING ORDER BY (timestamp DESC);

-- Production Process Steps
CREATE TABLE production_steps (
    factory_id TEXT,
    step_id TEXT,
    name TEXT,
    PRIMARY KEY ((factory_id, step_id))
);

-- Step-Sensor Relationships
CREATE TABLE step_sensors (
    factory_id TEXT,
    step_id TEXT,
    sensor_id TEXT,
    PRIMARY KEY ((factory_id, step_id), sensor_id)
);

-- Alerts Table
CREATE TABLE alerts (
    sensor_id TEXT,
    alert_time TIMESTAMP,
    alert_id TEXT,
    type TEXT,
    value FLOAT,
    status TEXT,
    PRIMARY KEY (sensor_id, alert_time, alert_id)
) WITH CLUSTERING ORDER BY (alert_time DESC);