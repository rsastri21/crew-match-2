"use server";

import { deleteCandidate } from "@/data/candidates";
import { updateRole } from "@/data/roles";
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
        revalidatePath("/admin/candidates");
    });

export const assignCandidateAction = authenticatedAction
    .createServerAction()
    .input(assignCandidateSchema)
    .handler(async ({ input }) => {
        await updateRole(input.roleId, { candidateId: input.id });
        revalidatePath("/admin/candidates");
    });
