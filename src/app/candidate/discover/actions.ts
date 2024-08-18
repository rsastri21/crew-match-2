"use server";

import { updateCandidate } from "@/data/candidates";
import { authenticatedAction } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export const updateCandidateAction = authenticatedAction
    .createServerAction()
    .input(
        z.object({
            name: z.string(),
            userId: z.string(),
            candidateId: z.number({
                required_error: "Candidate ID must be provided.",
            }),
        })
    )
    .handler(async ({ input }) => {
        await updateCandidate(input.candidateId, {
            name: input.name,
            userId: input.userId,
            updatedAt: new Date(),
        });
        revalidatePath("/candidate/register", "page");
        redirect("/candidate/register");
    });
