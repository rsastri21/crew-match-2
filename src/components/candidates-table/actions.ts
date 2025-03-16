"use server";

import { deleteCandidate } from "@/data/candidates";
import { getProductionById } from "@/data/productions";
import { getRoleById, updateRole } from "@/data/roles";
import { authenticatedAction } from "@/lib/safe-action";
import { batchInsertCandidates } from "@/utils/candidates";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const candidateSchema = z.object({
    name: z.string(),
    yearsInUW: z.number().nonnegative(),
    quartersInLUX: z.number().nonnegative(),
    isActing: z.boolean(),
    prioritizeProductions: z.boolean(),
    interestedProductions: z.string().array(),
    interestedRoles: z.string().array(),
});

const deleteCandidateSchema = z.object({
    id: z.number().nonnegative(),
});

const assignCandidateSchema = z.object({
    id: z.number().nonnegative(),
    roleId: z.number().nonnegative(),
});

const removeCandidateSchema = z.object({ roleId: z.number().nonnegative() });

export const uploadCandidateAction = authenticatedAction
    .createServerAction()
    .input(z.array(candidateSchema))
    .handler(async ({ input }) => {
        const numCandidatesInserted = await batchInsertCandidates(input);
        revalidatePath("/admin");
        return numCandidatesInserted;
    });

export const deleteCandidateAction = authenticatedAction
    .createServerAction()
    .input(deleteCandidateSchema)
    .handler(async ({ input }) => {
        await deleteCandidate(input.id);
        revalidatePath("/");
    });

export const assignCandidateAction = authenticatedAction
    .createServerAction()
    .input(assignCandidateSchema)
    .handler(async ({ input, ctx }) => {
        const user = ctx.user;

        /**
         * If the user is a production head and not an admin,
         * validate that they are trying to assign a candidate
         * to their own production.
         */
        if (!user.isAdmin && user.role === "production_head") {
            const roleObj = await getRoleById(input.roleId);
            if (!roleObj) {
                throw new Error("Role does not exist.");
            }

            const production = await getProductionById(roleObj.productionId);
            if (!production || production.userId !== user.id) {
                throw new Error(
                    "Cannot assign candidate to another production."
                );
            }
        }

        await updateRole(input.roleId, { candidateId: input.id });
        revalidatePath("/");
    });

export const removeCandidateAction = authenticatedAction
    .createServerAction()
    .input(removeCandidateSchema)
    .handler(async ({ input, ctx }) => {
        const user = ctx.user;

        /**
         * If the user is a production head and not an admin,
         * validate that they are trying to remove a candidate
         * from their production.
         */
        if (!user.isAdmin && user.role === "production_head") {
            const roleObj = await getRoleById(input.roleId);
            if (!roleObj) {
                throw new Error("Role does not exist.");
            }

            const production = await getProductionById(roleObj.productionId);
            if (!production || production.userId !== user.id) {
                throw new Error(
                    "Cannot remove candidate from another production."
                );
            }
        }

        await updateRole(input.roleId, { candidateId: null });
        revalidatePath("/");
    });
