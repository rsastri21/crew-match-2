import { getCurrentUser } from "@/lib/session";
import { getUserCandidateProfile } from "@/utils/users";
import { redirect } from "next/navigation";
import CandidateRegistration from "./_components/CandidateRegistration.client";
import { getCandidateRegistrationStatus } from "@/data/configs";
import { Badge } from "@/components/ui/badge";
import { getAllProductions } from "@/data/productions";
import { getAllRoles } from "@/data/roles";
import { ROLES } from "@/data/constants";

export default async function CandidateRegistrationPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const userInfo = await getUserCandidateProfile(user.id);
    const isRegistrationOpen = await getCandidateRegistrationStatus();

    const productions = await getAllProductions();
    const productionNames = productions.map((production) => production.name);

    const roles = await getAllRoles();
    const roleNames = Array.from(
        new Set([...ROLES, ...roles.map((role) => role.role)])
    ).toSorted();

    return (
        <div className="container py-2 flex flex-col gap-2 items-center mx-auto">
            {!isRegistrationOpen && (
                <Badge className="bg-destructive text-lg text-foreground">
                    Registration is not currently open.
                </Badge>
            )}
            <div className="px-2 py-4 w-full md:w-3/4 flex flex-col">
                <h1 className="text-3xl font-bold">Register</h1>
                <p className="text-lg font-medium text-muted-foreground">
                    Enter or modify your registration information for the
                    upcoming quarter. Your changes will be saved for two days,
                    so you may leave this page and continue registering later.
                </p>
            </div>
            <CandidateRegistration
                userInfo={userInfo}
                productions={productionNames}
                roles={roleNames}
                isRegistrationOpen={isRegistrationOpen}
            />
        </div>
    );
}
