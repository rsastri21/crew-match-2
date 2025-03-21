import { db } from "@/db";
import { Production, productions } from "@/db/schema";
import { count, eq } from "drizzle-orm";

export type ProductionRow = {
    id: number;
    name: string;
    roles: string;
    lead: string;
    createdAt: Date;
    updatedAt: Date;
};

export async function createProduction(
    name: string,
    genre: string,
    logline: string,
    logistics: string,
    lookingFor: string,
    pitchLink: string,
    userId?: string
) {
    const [production] = await db
        .insert(productions)
        .values({
            name,
            genre,
            logline,
            logistics,
            lookingFor,
            pitchLink,
            userId,
        })
        .returning();
    return production;
}

export async function updateProduction(
    productionId: number,
    updatedProduction: Partial<Production>
) {
    const [production] = await db
        .update(productions)
        .set(updatedProduction)
        .where(eq(productions.id, productionId))
        .returning();
    return production;
}

export async function getProductionByUserId(userId: string) {
    const production = await db.query.productions.findFirst({
        where: eq(productions.userId, userId),
    });

    return production;
}

export async function getProductionById(productionId: number) {
    const production = await db.query.productions.findFirst({
        where: eq(productions.id, productionId),
    });

    return production;
}

// TODO: Add timestamp parameter once quarter sessions are setup
export async function getAllProductionsWithRoles() {
    const productions = await db.query.productions.findMany({
        with: {
            roles: {
                with: {
                    candidate: {
                        columns: {
                            name: true,
                        },
                    },
                },
            },
        },
    });

    return productions;
}

export async function getAllProductionsWithAvailableRoles() {
    const productions = await db.query.productions.findMany({
        with: {
            roles: {
                where: (role, { isNull }) => isNull(role.candidateId),
            },
        },
    });

    return productions;
}

export async function getProductionWithEmptyRoles(userId: string) {
    const production = await db.query.productions.findFirst({
        where: eq(productions.userId, userId),
        with: {
            roles: {
                where: (role, { isNull }) => isNull(role.candidateId),
            },
        },
    });
    return production;
}

export async function getProductionWithRoles(productionId: number) {
    const production = await db.query.productions.findFirst({
        where: eq(productions.id, productionId),
        with: {
            roles: {
                with: {
                    candidate: {
                        columns: {
                            name: true,
                        },
                    },
                },
            },
        },
    });

    return production;
}

export async function getProductionCount() {
    return db.select({ count: count() }).from(productions);
}

export async function getAllProductions() {
    return db.query.productions.findMany();
}

export async function deleteProduction(productionId: number) {
    await db.delete(productions).where(eq(productions.id, productionId));
}

export async function deleteAllProductions() {
    await db.delete(productions);
}
