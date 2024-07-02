"use server";

import { unauthenticatedAction } from "@/lib/safe-action";
import { setSession } from "@/lib/session";
import { z } from "zod";

export const signUpAction = unauthenticatedAction
    .createServerAction()
    .input(
        z.object({
            email: z.string().email(),
            password: z.string().min(8),
            role: z.enum(["user", "production_head"]),
        })
    )
    .handler(async ({ input }) => {
        console.log(input);
    });
