import { defineConfig } from "drizzle-kit";
import { read } from "node:fs";
import { readConfig } from "./src/config";

export default defineConfig({
  schema: "src/lib/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: readConfig().dbUrl,
  },
});