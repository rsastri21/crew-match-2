import { ROLES } from "@/data/constants";
import {
    createProduction,
    getAllProductionsWithAvailableRoles,
    getAllProductionsWithRoles,
    getProductionWithEmptyRoles,
    ProductionRow,
    updateProduction,
} from "@/data/productions";
import {
    batchUpdateRoles,
    createRoles,
    deleteRole,
    getProductionDirectorName,
    PendingCreateRole,
} from "@/data/roles";
import {
    Production,
    ProductionWithRoles,
    Role,
    RoleWithCandidateName,
    User,
} from "@/db/schema";
import { cache } from "react";
import { getAmountFilled } from "./productionClientUtils";
import { getUserProfile } from "./users";
import { Roles } from "./types";

export async function transformProductionsToRowModel(
    productions: (Production & { roles: RoleWithCandidateName[] })[]
) {
    const rows: ProductionRow[] = [];

    for (const production of productions) {
        const userProfile = await getUserProfile(production.userId!);
        const { filled, total } = getAmountFilled(production.roles);
        rows.push({
            id: production.id,
            name: production.name,
            roles: `${filled}/${total}`,
            lead: userProfile.name ?? "",
            createdAt: production.createdAt,
            updatedAt: production.updatedAt,
        });
    }

    return rows;
}

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
    rolesToDelete: number[],
    rolesToEdit: Roles[]
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

    const rolesToUpdate: Role[] = rolesToEdit.map((role) => {
        return {
            id: role.id!,
            role: role.role,
            production: role.production,
            productionId: role.productionId,
            candidateId: role.candidateId,
        };
    });

    await batchUpdateRoles(rolesToUpdate);

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

export async function getProductionsForMatching() {
    const productions = await getAllProductionsWithAvailableRoles();

    if (!productions.length) {
        throw new Error("No productions available for matching.");
    }

    return productions;
}
