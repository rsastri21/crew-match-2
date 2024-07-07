import "dotenv/config";

import { migrate as NeonMigrate } from "drizzle-orm/neon-http/migrator";
import { migrate as PostgresMigrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./index";
import * as schema from "./schema";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const main = async () => {
    if (process.env.NODE_ENV === "production") {
        try {
            await NeonMigrate(db as NeonHttpDatabase<typeof schema>, {
                migrationsFolder: "./src/db/migrations",
            });
            console.log("Migration completed.");
        } catch (error) {
            console.error("Error during migration:", error);
            process.exit(1);
        }
    } else {
        try {
            const migrationClient = postgres(process.env.DATABASE_URL!, {
                max: 1,
            });
            await PostgresMigrate(drizzle(migrationClient), {
                migrationsFolder: "./src/db/migrations",
            });
            await migrationClient.end();
            console.log("Migration completed.");
        } catch (error) {
            console.error("Error during migration:", error);
            process.exit(1);
        }
    }
};

main();
