import { getCurrentUser } from "@/lib/session";
import { getUserCandidateProfile } from "@/utils/users";
import { redirect } from "next/navigation";
import UserDashboardClient from "./_components/UserDashboard.client";
import { getCandidateAssignments } from "@/data/candidates";

export default async function UserDashboard() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const userInfo = await getUserCandidateProfile(user.id);
    const assignments = await getCandidateAssignments(user.id);

    return <UserDashboardClient user={userInfo} assignments={assignments} />;
}
