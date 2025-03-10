"use server";

import { authenticatedAction } from "@/lib/safe-action";
import {
    createProductionWithDefaultRoles,
    editProduction,
} from "@/utils/productions";
import { redirect } from "next/navigation";
import { z } from "zod";

export const createProductionAction = authenticatedAction
    .createServerAction()
    .input(
        z.object({
            name: z.string(),
            genre: z.string(),
            logline: z.string(),
            logistics: z.string(),
            lookingFor: z.string(),
            pitchLink: z.string(),
            userId: z.string(),
        })
    )
    .handler(async ({ input }) => {
        const production = await createProductionWithDefaultRoles(
            input.name,
            input.genre,
            input.logline,
            input.logistics,
            input.lookingFor,
            input.pitchLink,
            input.userId
        );
        redirect(`/production/${production.id}/view`);
    });

export const editProductionAction = authenticatedAction
    .createServerAction()
    .input(
        z.object({
            productionId: z.number(),
            name: z.string(),
            genre: z.string(),
            logline: z.string(),
            logistics: z.string(),
            lookingFor: z.string(),
            pitchLink: z.string(),
            userId: z.string(),
            rolesToCreate: z.string().array(),
            rolesToDelete: z.number().array(),
        })
    )
    .handler(async ({ input }) => {
        const { rolesToCreate, rolesToDelete, productionId, ...production } =
            input;

        const editedProduction = await editProduction(
            productionId,
            { ...production, updatedAt: new Date() },
            rolesToCreate,
            rolesToDelete
        );
        redirect(`/production/${productionId}/view`);
    });
