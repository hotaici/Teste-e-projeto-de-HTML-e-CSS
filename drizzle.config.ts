import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",   // onde estão as tabelas
  out: "./drizzle",           // pasta para arquivos de migração (opcional neste projeto)
  dialect: "postgresql",      // o Neon é um banco PostgreSQL
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});