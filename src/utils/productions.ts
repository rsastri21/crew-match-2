import { ROLES } from "@/data/constants";
import {
    createProduction,
    getAllProductionsWithRoles,
} from "@/data/productions";
import {
    createRoles,
    getProductionDirectorName,
    PendingCreateRole,
} from "@/data/roles";
import { ProductionWithRoles } from "@/db/schema";
import { cache } from "react";

export async function getDirectorsForProductions(
    productions: ProductionWithRoles[]
) {
    const directorsList: string[] = [];

    for (const production of productions) {
        const director = await getProductionDirectorName(production.id);
        directorsList.push(director ?? "");
    }

    return directorsList;
}

export const getProductionsInformation = cache(getAllProductionsWithRoles);

export async function createProductionWithDefaultRoles(
    name: string,
    genre: string,
    logline: string,
    logistics: string,
    lookingFor: string,
    pitchLink: string,
    userId: string
) {
    const production = await createProduction(
        name,
        genre,
        logline,
        logistics,
        lookingFor,
        pitchLink,
        userId
    );

    const defaultRoles: PendingCreateRole[] = ROLES.map((role: string) => {
        return {
            role,
            production: production.name,
            productionId: production.id,
        };
    });

    await createRoles(defaultRoles);

    return production;
}
