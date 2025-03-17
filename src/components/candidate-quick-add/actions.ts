"use server";

import { updateRole } from "@/data/roles";
import { authenticatedAction } from "@/lib/safe-action";
import { quickRegisterCandidate } from "@/utils/candidates";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const quickCreateSchema = z.object({
    name: z.string().min(1, { message: "A candidate name is required." }),
    roleId: z.number(),
});

export const quickCreateAction = authenticatedAction
    .createServerAction()
    .input(quickCreateSchema)
    .handler(async ({ input }) => {
        const candidate = await quickRegisterCandidate(
            input.name,
            null,
            false,
            true
        );
        const role = await updateRole(input.roleId, {
            candidateId: candidate.id,
        });
        revalidatePath("/production");
        return candidate;
    });
