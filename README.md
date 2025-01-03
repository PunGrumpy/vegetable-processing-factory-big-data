# 🫛 IoT Vegetable Processing Factory

A scalable IoT-based system for monitoring and controlling vegetable processing operations. This project uses ScyllaDB for real-time data storage and analysis of production states, sensor readings, and system alerts

## 🌱 Setup

### 📦 Requirements

- Node.js v23.0.0
- [Bun](https://bun.sh) v1.0.0 or [PNPM](https://pnpm.io) v9.0.0
- [Docker](https://www.docker.com) v27.0.0

### 🚀 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/PunGrumpy/vet-processing-factory.git
```

2. Install the dependencies:

```bash
bun install
# or
pnpm install
```

3. Start the development server:

```bash
bun dev # now it's initializing the database only
# or
pnpm dev
```

> [!NOTE]
> Running database server before starting the development server is required.
> `bun db:setup` or `pnpm db:setup` can be used to initialize the database.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
