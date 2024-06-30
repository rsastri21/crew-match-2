import "dotenv/config";

import { migrate } from "drizzle-orm/neon-http/migrator";
import { db } from "./index";
migrate(db, { migrationsFolder: "./src/db/migrations" });
