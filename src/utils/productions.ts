import { getAllProductionsWithRoles } from "@/data/productions";
import { getProductionDirectorName } from "@/data/roles";
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
