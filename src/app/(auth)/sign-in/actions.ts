"use server";

import { unauthenticatedAction } from "@/lib/safe-action";
import { z } from "zod";

export const signInMagicLinkAction = unauthenticatedAction
    .createServerAction()
    .input(
        z.object({
            email: z.string().email(),
        })
    )
    .handler(async ({ input }) => {
        console.log(input);
    });
