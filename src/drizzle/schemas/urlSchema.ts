import { pgTable, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const UrlSchema = pgTable(
  "url",
  {
    id: uuid("id").unique().notNull().defaultRandom(),
    longUrl: varchar("longUrl").notNull(),
    shortUrl: varchar("shortUrl", { length: 255 }).notNull().unique(),
  },
  (table) => {
    return {
      shortUrlIndex: uniqueIndex("shortUrlIndex").on(table.shortUrl),
    };
  }
);
