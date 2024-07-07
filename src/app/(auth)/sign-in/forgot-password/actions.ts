"use server";

import { unauthenticatedAction } from "@/lib/safe-action";
import { resetPassword } from "@/utils/users";
import { z } from "zod";

export const resetPasswordAction = unauthenticatedAction
    .createServerAction()
    .input(
        z.object({
            email: z.string().email(),
        })
    )
    .handler(async ({ input }) => {
        await resetPassword(input.email);
    });
