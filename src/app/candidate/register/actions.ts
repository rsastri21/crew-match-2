"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { registerCandidate } from "@/utils/candidates";
import { redirect } from "next/navigation";
import { z } from "zod";

export const createCandidateAction = authenticatedAction
    .createServerAction()
    .input(
        z.object({
            name: z.string(),
            userId: z.string(),
            yearsInUW: z.number().nonnegative(),
            quartersInLUX: z.number().nonnegative(),
            isActing: z.boolean(),
            prioritizeProductions: z.boolean(),
            interestedRoles: z.string().array().max(3),
            interestedProductions: z.string().array(),
        })
    )
    .handler(async ({ input }) => {
        await registerCandidate(
            input.name,
            input.userId,
            input.isActing,
            input.prioritizeProductions,
            input.interestedRoles,
            input.interestedProductions,
            input.yearsInUW,
            input.quartersInLUX
        );
        redirect("/user/dashboard");
    });
