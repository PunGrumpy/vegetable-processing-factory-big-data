-- Insert factory
INSERT INTO factories (factory_id, name, location)
VALUES ('12345', 'โรงงาน A', 'Bangkok, Thailand');

-- Insert temperature sensor
INSERT INTO sensors (sensor_id, type, location, unit, threshold_min, threshold_max)
VALUES ('temp_001', 'Temperature Sensor', 'Lavage Area', '°C', 5, 50);

-- Insert sensor data
INSERT INTO sensor_data (sensor_id, timestamp, value)
VALUES ('temp_001', '2025-03-11T10:00:00Z', 42.5);

-- Insert production step
INSERT INTO production_steps (factory_id, step_id, name)
VALUES ('12345', '1', 'การคัดเลือกและล้างวัตถุดิบ');

-- Link step with sensors
INSERT INTO step_sensors (factory_id, step_id, sensor_id)
VALUES ('12345', '1', 'temp_001');

-- Insert alert
INSERT INTO alerts (sensor_id, alert_time, alert_id, type, value, status)
VALUES ('temp_001', '2025-03-11T10:10:00Z', 'alert_001', 'Temperature High', 52, 'Unresolved');