"use server";

import {
    createNewSession,
    updateCandidateRegistrationStatus,
    updateProductionCreationStatus,
} from "@/data/configs";
import { authenticatedAction } from "@/lib/safe-action";
import { AdminError } from "@/utils/errors";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const candidateRegistrationConfigSchema = z.object({
    enabled: z.boolean(),
});

const productionCreationConfigSchema = z.object({
    enabled: z.boolean(),
});

export const registrationConfigUpdateAction = authenticatedAction
    .createServerAction()
    .input(candidateRegistrationConfigSchema)
    .handler(async ({ input, ctx }) => {
        const user = ctx.user;

        if (!user.isAdmin) {
            throw new AdminError();
        }

        await updateCandidateRegistrationStatus(input.enabled);
        revalidatePath("/");
    });

export const creationConfigUpdateAction = authenticatedAction
    .createServerAction()
    .input(productionCreationConfigSchema)
    .handler(async ({ input, ctx }) => {
        const user = ctx.user;

        if (!user.isAdmin) {
            throw new AdminError();
        }

        await updateProductionCreationStatus(input.enabled);
        revalidatePath("/");
    });

export const newSessionAction = authenticatedAction
    .createServerAction()
    .handler(async ({ ctx }) => {
        const user = ctx.user;

        if (!user.isAdmin) {
            throw new AdminError();
        }

        // TODO: Need to also delete candidates, roles, and productions here
        await createNewSession();
        revalidatePath("/");
    });
