import type { Role } from "@/db/schema";

export type MatchServiceInput = {
    [production: string]: {
        [role: string]: Role;
    };
};
