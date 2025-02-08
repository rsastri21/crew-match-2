"use server";

import { deleteProduction } from "@/data/productions";
import { authenticatedAction } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const deleteProductionSchema = z.object({
    id: z.number().nonnegative(),
});

export const deleteProductionAction = authenticatedAction
    .createServerAction()
    .input(deleteProductionSchema)
    .handler(async ({ input }) => {
        await deleteProduction(input.id);
        revalidatePath("/");
    });
