import { getCurrentUser } from "@/lib/session";
import { getUserCandidateProfile } from "@/utils/users";
import { redirect } from "next/navigation";
import UserDashboardClient from "./_components/UserDashboard.client";

export default async function UserDashboard() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const userInfo = await getUserCandidateProfile(user.id);

    return <UserDashboardClient {...userInfo} />;
}
