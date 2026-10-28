import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const filmes = pgTable("filmes", {
  id: serial("id").primaryKey(),
  titulo: varchar("titulo", { length: 120 }).notNull(),
  genero: varchar("genero", { length: 40 }).notNull(),
  status: varchar("status", { length: 15 }).notNull().default("quero_ver"),
  nota: integer("nota"), // null enquanto não assistiu
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
});