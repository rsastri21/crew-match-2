import {
    drizzle as NeonDrizzle,
    NeonHttpDatabase,
} from "drizzle-orm/neon-http";
import {
    drizzle as LocalDrizzle,
    PostgresJsDatabase,
} from "drizzle-orm/postgres-js";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";
import postgres from "postgres";

let db: PostgresJsDatabase<typeof schema> | NeonHttpDatabase<typeof schema>;
if (process.env.NODE_ENV === "production") {
    const sql = neon(process.env.DATABASE_URL!);
    db = NeonDrizzle(sql, { schema });
} else {
    const queryClient = postgres(process.env.DATABASE_URL!);
    db = LocalDrizzle(queryClient, { schema });
}

export { db };
