export { seedDatabase } from './seed/index'

if (import.meta.url === Bun.main) {
  const { seedDatabase } = await import('./seed/index')
  await seedDatabase()
}
