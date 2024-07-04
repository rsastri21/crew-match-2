"use server";

import { unauthenticatedAction } from "@/lib/safe-action";
import { setSession } from "@/lib/session";
import { registerUser } from "@/utils/users";
import { redirect } from "next/navigation";
import { z } from "zod";

export const signUpAction = unauthenticatedAction
    .createServerAction()
    .input(
        z.object({
            name: z.string().min(1),
            email: z.string().email(),
            password: z.string().min(8),
            role: z.enum(["user", "production_head"], {
                message: "Invalid role provided.",
            }),
        })
    )
    .handler(async ({ input }) => {
        const user = await registerUser(
            input.name,
            input.email,
            input.password,
            input.role
        );
        return redirect("/sign-up/email/verify");
    });
