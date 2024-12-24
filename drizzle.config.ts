import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  schema: './src/lib/db/migrations/schema.ts',
  out: './src/lib/db/migrations',
  entities: {
    roles: {
      provider: 'neon',
    }
  }
});