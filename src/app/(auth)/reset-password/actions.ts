"use server";

import { unauthenticatedAction } from "@/lib/safe-action";
import { changePassword } from "@/utils/users";
import { z } from "zod";

export const changePasswordAction = unauthenticatedAction
    .createServerAction()
    .input(
        z.object({
            token: z.string(),
            password: z.string().min(8),
        })
    )
    .handler(async ({ input }) => {
        await changePassword(input.token, input.password);
    });
