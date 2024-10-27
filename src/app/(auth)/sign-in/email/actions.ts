"use server";

import { unauthenticatedAction } from "@/lib/safe-action";
import { setSession } from "@/lib/session";
import { getDashboardUrl } from "@/utils/redirects";
import { signInUser } from "@/utils/users";
import { redirect } from "next/navigation";
import { z } from "zod";

export const signInAction = unauthenticatedAction
    .createServerAction()
    .input(
        z.object({
            email: z.string().email(),
            password: z.string().min(8),
        })
    )
    .handler(async ({ input }) => {
        const user = await signInUser(input.email, input.password);
        await setSession(user.id);
        redirect(getDashboardUrl(user.role));
    });
