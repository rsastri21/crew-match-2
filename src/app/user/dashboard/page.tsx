import { getCurrentUser } from "@/lib/session";
import { getUserCandidateProfile } from "@/utils/users";
import { redirect } from "next/navigation";
import UserDashboardClient from "./_components/UserDashboard.client";
import { getCandidateAssignments } from "@/data/candidates";
import {
    getDirectorsForProductions,
    getProductionsInformation,
} from "@/utils/productions";
import { getCandidateRegistrationStatus } from "@/data/configs";

export default async function UserDashboard() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const userInfo = await getUserCandidateProfile(user.id);
    const assignments = await getCandidateAssignments(user.id);
    const productionsWithRoles = await getProductionsInformation();
    const directors = await getDirectorsForProductions(productionsWithRoles);
    const isRegistrationOpen = await getCandidateRegistrationStatus();

    return (
        <UserDashboardClient
            user={userInfo}
            assignments={assignments}
            productions={productionsWithRoles}
            directors={directors}
            isRegistrationOpen={isRegistrationOpen}
        />
    );
}
