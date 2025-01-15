import type { ProductionWithRoles, RoleWithCandidateName } from "@/db/schema";
import { PartialBy } from "@/utils/types";
import { useState } from "react";

export type Roles = PartialBy<RoleWithCandidateName, "id">;

function useModifyProduction(production?: ProductionWithRoles) {
    const [roles, setRoles] = useState<Roles[]>(production?.roles ?? []);
    const [rolesToDelete, setRolesToDelete] = useState<Roles[]>([]);

    const handleRemoveRole = (roleToRemove: Roles, index: number) => {
        const newRolesToDelete = [...rolesToDelete];
        if (roleToRemove.id) {
            newRolesToDelete.push(roleToRemove);
            setRolesToDelete(newRolesToDelete);
        }
        const newRoles = roles.filter((_, i) => index !== i);
        setRoles(newRoles);
    };

    const handleAddRole = (roleName: string) => {
        const roleToAdd: Roles = {
            role: roleName,
            production: production!.name,
            productionId: production!.id,
            candidateId: null,
            candidate: null,
        };
        const newRoles = [...roles, roleToAdd];
        setRoles(newRoles);
    };

    const getSubmissionExpectations = () => {
        const rolesToSubmit: string[] = roles.reduce((acc: string[], curr) => {
            if (!curr.id) {
                acc.push(curr.role);
            }
            return acc;
        }, []);
        const roleIdsToDelete: number[] = rolesToDelete.map(
            (roleToDelete) => roleToDelete.id!
        );
        return {
            create: rolesToSubmit,
            delete: roleIdsToDelete,
        };
    };

    const reset = () => {
        setRoles(production?.roles ?? []);
        setRolesToDelete([]);
    };

    return {
        roles,
        handleAddRole,
        handleRemoveRole,
        getSubmissionExpectations,
        reset,
    };
}

export { useModifyProduction };
