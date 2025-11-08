/**
 * This helper is optional. Wire it to your existing server if you want tests.
 * Provide exports: app (Express), models (User, Post), and testUtils.
 * If your structure differs, adapt as needed.
 */
export const app = {} // placeholder to be adapted
export const models = {}
export const testUtils = {
  async seedUsers(){ return {} },
  tokenFor(){ return '' }
}
