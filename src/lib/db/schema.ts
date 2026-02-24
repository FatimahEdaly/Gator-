import { pgTable, timestamp, uuid, text, unique, } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
 
});


export const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  last_fetched_at: timestamp("last_fetched_at"),

});
export const feed_follows=pgTable("feed_follows",{

   id: uuid("id").primaryKey().defaultRandom().notNull(),
   createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
    
     user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      feed_id: uuid("feed_id").notNull().references(() => feeds.id, { onDelete: "cascade" }),
      

}
, (table) => ({
  // Ensure a user can't follow the same feed twice
  uniqFollow: unique().on(table.user_id, table.feed_id),
})
);

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  title: text("title").notNull(),
  url: text("url").notNull().unique(), // منع التكرار
  description: text("description"),
  publishedAt: timestamp("published_at"),
  feedId: uuid("feed_id").notNull().references(() => feeds.id, { onDelete: "cascade" }),
});
export type Feed = typeof feeds.$inferSelect; // feeds is the table object in schema.ts
export type User = typeof users.$inferSelect;