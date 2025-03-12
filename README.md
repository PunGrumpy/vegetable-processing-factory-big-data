# 🫛 IoT Vegetable Processing Factory Big Data

A scalable IoT-based system for monitoring and controlling vegetable processing operations. This project uses MongoDB for real-time data storage and analysis of production states, sensor readings, and system parameters.

## 🌱 Project Overview

This system collects and manages three main types of data:

1. **Production States** - Records each stage of the vegetable processing, including batch information, temperatures, humidity, and other production metrics.
2. **Sensor Data** - Collects readings from various sensors throughout the factory, including temperature, humidity, pressure, and more.
3. **State Parameters** - Stores settings and configurations for each production state.

## 📦 Requirements

- Node.js v18.0.0+
- [Bun](https://bun.sh) v1.0.0+
- MongoDB (via MongoDB Atlas or local instance)

## 🚀 Getting Started

### Installation

1. Clone the repository:

```bash
git clone https://github.com/PunGrumpy/vegetable-processing-factory-big-data.git
cd vegetable-processing-factory-big-data
```

2. Install the dependencies:

```bash
bun install
```

3. Copy the environment file and configure your MongoDB connection:

```bash
cp .env.example .env.local
# Edit .env.local with your MongoDB connection string and database name
```

### Database Setup and Seeding

1. Initialize the database connection:

```bash
bun db:setup
```

2. Seed the database with sample data:

```bash
bun seed
```

You can also seed specific collections:

```bash
bun seed:production  # Seed only production states
bun seed:sensors     # Seed only sensor data
bun seed:parameters  # Seed only state parameters
```

### Using the CLI

The project includes a CLI for common operations:

```bash
# Start the application
bun dev

# Seed the database via CLI
bun dev:seed

# Query and display database statistics
bun dev:query
```

## 🗄️ Data Models

### Production State

```typescript
{
  batch_id: string // Unique batch identifier
  state_id: string // Unique state identifier
  timestamp: Date // When this state was recorded
  state_name: string // Name of the processing state (e.g., "Washing")
  previous_state: string // ID of the previous state
  duration: number // Duration in minutes
  temperature: number // Temperature in Celsius
  humidity: number // Humidity percentage
  conveyor_speed: number // Speed in meters per second
  product_count: number // Number of products processed
  defect_percentage: number // Percentage of defective products
  water_consumption: number // Water used in liters
  energy_consumption: number // Energy used in kWh
}
```

### Sensor Data

```typescript
{
  sensor_id: string // Unique sensor identifier
  state_id: string // Associated state identifier
  timestamp: Date // When the reading was taken
  sensor_type: string // Type of sensor (temperature, humidity, etc.)
  value: number // Sensor reading value
  unit: string // Measurement unit
  location: string // Physical location of sensor
}
```

### State Parameter

```typescript
{
  state_id: string       // Associated state identifier
  parameter_name: string // Name of the parameter
  parameter_type: string // Type: numeric, text, or boolean
  numeric_value?: number // Value if type is numeric
  text_value?: string    // Value if type is text
  boolean_value?: boolean // Value if type is boolean
  timestamp: Date        // When the parameter was set
}
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
