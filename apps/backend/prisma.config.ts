import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

if (fs.existsSync('.env')) {
  dotenv.config();
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'tsx ./prisma/seed.ts'
  },
  datasource: {
    url: process.env.DATABASE_URL
  }
})