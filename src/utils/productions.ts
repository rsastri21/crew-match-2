import { ROLES } from "@/data/constants";
import {
    createProduction,
    getAllProductionsWithAvailableRoles,
    getAllProductionsWithRoles,
    getProductionWithEmptyRoles,
    updateProduction,
} from "@/data/productions";
import {
    createRoles,
    deleteRole,
    getProductionDirectorName,
    PendingCreateRole,
} from "@/data/roles";
import { Production, ProductionWithRoles, User } from "@/db/schema";
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

export async function editProduction(
    productionId: number,
    updatedProduction: Partial<Production>,
    rolesToCreate: string[],
    rolesToDelete: number[]
) {
    const editedProduction = await updateProduction(
        productionId,
        updatedProduction
    );

    const roles: PendingCreateRole[] = rolesToCreate.map((role: string) => {
        return {
            role,
            production: editedProduction.name,
            productionId,
        };
    });

    if (roles.length) {
        await createRoles(roles);
    }
    await Promise.all(
        rolesToDelete.map((roleToDelete: number) => deleteRole(roleToDelete))
    );

    return editedProduction;
}

export async function getAssignableProductions(user: User) {
    /**
     * A user that is a production head and not admin
     * should only be able to assign a member to their own production.
     */
    if (!user.isAdmin && user.role === "production_head") {
        const production = await getProductionWithEmptyRoles(user.id);
        return production ? [production] : [];
    }
    return await getAllProductionsWithAvailableRoles();
}
