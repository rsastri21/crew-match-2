"use server";

import { updateCandidate } from "@/data/candidates";
import { updateProfile } from "@/data/profiles";
import { updateUser } from "@/data/users";
import { authenticatedAction } from "@/lib/safe-action";
import { AccountNotFoundError } from "@/utils/errors";
import { getUserCandidateProfile } from "@/utils/users";
import { revalidatePath } from "next/cache";

import { z } from "zod";

export const profileEditAction = authenticatedAction
    .createServerAction()
    .input(
        z.object({
            name: z.string().min(1),
            pronouns: z.string(),
            role: z.enum(["user", "production_head"], {
                message: "Invalid role provided.",
            }),
            userId: z.string(),
        })
    )
    .handler(async ({ input }) => {
        if (!input.userId) {
            throw new AccountNotFoundError();
        }

        const user = await getUserCandidateProfile(input.userId);

        if (user.candidate && user.candidate.name !== input.name) {
            await updateCandidate(user.candidate.id, { name: input.name });
        }
        await updateProfile(user.id, {
            name: input.name,
            pronouns: input.pronouns,
        });
        await updateUser(user.id, { role: input.role });
        revalidatePath("/");
    });
