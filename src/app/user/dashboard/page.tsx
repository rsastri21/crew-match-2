import { getCurrentUser } from "@/lib/session";
import { getUserCandidateProfile } from "@/utils/users";
import { redirect } from "next/navigation";
import UserDashboardClient from "./_components/UserDashboard.client";
import RegistrationSection from "./_components/RegistrationSection";
import AssignmentsSection from "./_components/AssignmentsSection";
import { Separator } from "@/components/ui/separator";

export default async function UserDashboard() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const userInfo = await getUserCandidateProfile(user.id);

    return (
        <UserDashboardClient user={userInfo}>
            <AssignmentsSection />
            <Separator />
            <RegistrationSection {...userInfo} />
        </UserDashboardClient>
    );
}
