"use server";

import { updateUser } from "@/data/users";
import { authenticatedAction } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const userUpdateSchema = z.object({
    id: z.string(),
    isAdmin: z.boolean(),
});

export const updateUserAction = authenticatedAction
    .createServerAction()
    .input(userUpdateSchema)
    .handler(async ({ input }) => {
        await updateUser(input.id, { isAdmin: input.isAdmin });
        revalidatePath("/admin/users");
    });
