"use server";

import { validateSessionCode } from "@/data/configs";
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
            registrationCode: z.string().min(6).max(6),
            yearsInUW: z.number().nonnegative(),
            quartersInLUX: z.number().nonnegative(),
            isActing: z.boolean(),
            prioritizeProductions: z.boolean(),
            interestedRoles: z
                .string()
                .array()
                .max(3, { message: "Please rank 3 roles." }),
            interestedProductions: z.string().array(),
        })
    )
    .handler(async ({ input }) => {
        /**
         * Validate that the registration code is correct
         * before registering.
         */
        const isValidCode = await validateSessionCode(
            "candidate",
            input.registrationCode
        );
        if (!isValidCode) {
            throw new Error("Invalid registration code.");
        }

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
