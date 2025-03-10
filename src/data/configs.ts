import { db } from "@/db";
import { Config, configs } from "@/db/schema";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";

const CONFIG_ID = 1;
const SESSION_CODE_LENGTH = 3;

async function getConfigs() {
    return db.query.configs.findFirst({
        where: eq(configs.id, CONFIG_ID),
    });
}

/**
 * The configs object is treated like an AppConfig.
 * There will be only one instance, and the util functions will repopulate
 * object with id = 1 if necessary.
 */

async function createConfig(attributes: Partial<Omit<Config, "id">>) {
    const config = {
        id: CONFIG_ID,
        ...attributes,
    };
    const [newConfig] = await db
        .insert(configs)
        .values(config)
        .onConflictDoNothing()
        .returning();
    return newConfig;
}

async function updateConfig<T extends keyof Omit<Config, "id">>(
    attribute: Config[T]
) {
    const config = (await getConfigs()) ?? { id: CONFIG_ID };

    const updatedConfig = {
        ...config,
        ...attribute,
    };
    return db
        .update(configs)
        .set(updatedConfig)
        .where(eq(configs.id, CONFIG_ID))
        .returning();
}

function generateSessionCode() {
    return randomBytes(SESSION_CODE_LENGTH).toString("hex").toUpperCase();
}

export async function getSessionCodes() {
    const config = await getConfigs();

    if (!config) {
        /**
         * Create config object for session codes
         */
        const candidateCode = generateSessionCode();
        const productionCode = generateSessionCode();

        const session = {
            candidate: candidateCode,
            production: productionCode,
        };
        const createdConfig = await createConfig({ session });

        return createdConfig!.session!;
    }
    return config.session!;
}

export async function createNewSession() {
    const session = {
        candidate: generateSessionCode(),
        production: generateSessionCode(),
    };
    await updateConfig<"session">(session);
}
