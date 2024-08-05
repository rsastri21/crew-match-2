"use client";

import { z } from "zod";

const candidateSchema = z.object({
    name: z.string(),
    userId: z.string(),
    yearsInUW: z
        .number({
            required_error: "A value for years in UW is required.",
        })
        .nonnegative({
            message: "The entered value must be greater than zero.",
        }),
    quartersInLUX: z
        .number({
            required_error: "A value for quarters in LUX is required.",
        })
        .nonnegative({
            message: "The entered value must be greater than zero.",
        }),
    isActing: z.boolean(),
    prioritizeProductions: z.boolean(),
    interestedRoles: z
        .string()
        .array()
        .max(3, { message: "Please select up to 3 roles." }),
    interestedProductions: z.string().array(),
});
