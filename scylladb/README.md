# 🧌 ScyllaDB

## 🚸 Schema Design

1. `factory_id` - Factory ID
2. `name` - Factory Name
3. `location` - Location of factory
4. `sensors` - List of sensors
   4.1 `sensor_id` - Sensor ID
   4.2 `type` - Type of sensor i.e. Temperature, Humidity, Pressure
   4.3 `location` - Location to place the sensor
   4.4 `unit` - Measurement unit i.e. °C, %, Pa
   4.5 `threshold` - Sensor threshold
   4.6 `data` - Sensor data recorded as time-series
5. `production_process` - Details of production process and related sensors
6. `alerts` - Alerts when sensor value exceeds a specific value

## 🏗️ Example Data

```json
{
  "factory_id": "12345",
  "name": "โรงงาน A",
  "location": "Bangkok, Thailand",
  "sensors": [
    {
      "sensor_id": "temp_001",
      "type": "Temperature Sensor",
      "location": "Lavage Area",
      "unit": "°C",
      "thresholds": {
        "min": 5,
        "max": 50
      },
      "data": [
        {
          "timestamp": "2025-03-11T10:00:00Z",
          "value": 42.5
        },
        {
          "timestamp": "2025-03-11T10:05:00Z",
          "value": 41.8
        }
      ]
    },
    {
      "sensor_id": "humidity_002",
      "type": "Humidity Sensor",
      "location": "Storage Room",
      "unit": "%",
      "thresholds": {
        "min": 30,
        "max": 60
      },
      "data": [
        {
          "timestamp": "2025-03-11T10:00:00Z",
          "value": 55
        }
      ]
    }
  ],
  "production_process": [
    {
      "step_id": "1",
      "name": "การคัดเลือกและล้างวัตถุดิบ",
      "sensors": ["temp_001", "humidity_002"]
    },
    {
      "step_id": "2",
      "name": "การลวกและทำให้เย็น",
      "sensors": ["temp_001"]
    }
  ],
  "alerts": [
    {
      "alert_id": "alert_001",
      "sensor_id": "temp_001",
      "timestamp": "2025-03-11T10:10:00Z",
      "type": "Temperature High",
      "value": 52,
      "status": "Unresolved"
    }
  ]
}
```
