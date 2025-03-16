import type { ProductionWithRoles, RoleWithCandidateName } from "@/db/schema";
import { PartialBy } from "@/utils/types";
import { useState } from "react";

export type Roles = PartialBy<RoleWithCandidateName, "id">;

/**
 * Utility function that gets the difference between two arrays depending on the provided
 * object keys.
 *
 * ex:
 * arr1: [{ id: 1, name: 'Anthony' }, { id: 2, name: 'Brandon' }]
 * arr2: [{ id: 1, name: 'Andrew' }, { id: 2, name: 'Brandon' }]
 *
 * getDifference(arr1, arr2, "id", "name") -> [{ id: 1, name: 'Anthony' }]
 *
 * @param array1
 * @param array2
 * @param keys
 * @returns
 */
function getDifference<T>(array1: T[], array2: T[], ...keys: Array<keyof T>) {
    return array1.filter(
        (obj1) => !array2.some((obj2) => keys.every((k) => obj1[k] === obj2[k]))
    );
}

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

    const handleDropCandidate = (index: number) => {
        const newRoles = roles.map((role, i) => {
            if (index === i) {
                return {
                    ...role,
                    candidateId: null,
                    candidate: null,
                };
            } else {
                return role;
            }
        });
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
        const rolesToEdit: Roles[] = getDifference(
            roles.filter((role) => role.id),
            production?.roles ?? [],
            "id",
            "role",
            "candidateId"
        );
        return {
            create: rolesToSubmit,
            delete: roleIdsToDelete,
            edit: rolesToEdit,
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
        handleDropCandidate,
        getSubmissionExpectations,
        reset,
    };
}

export { useModifyProduction };
