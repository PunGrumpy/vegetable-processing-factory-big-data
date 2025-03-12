// Re-export from the new structure
export { seedDatabase } from './seed/index'

// Run seeding if this file is executed directly
if (import.meta.url === Bun.main) {
  const { seedDatabase } = await import('./seed/index')
  await seedDatabase()
}
