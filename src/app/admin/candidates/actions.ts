"use server";

import { authenticatedAction } from "@/lib/safe-action";
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

export const uploadCandidateAction = authenticatedAction
    .createServerAction()
    .input(z.array(candidateSchema))
    .handler(async ({ input }) => {
        console.log(input);
    });
