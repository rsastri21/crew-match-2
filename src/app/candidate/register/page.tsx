import { getCurrentUser } from "@/lib/session";
import { getUserCandidateProfile } from "@/utils/users";
import { redirect } from "next/navigation";

export default async function CandidateRegistrationPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const userInfo = await getUserCandidateProfile(user.id);

    return (
        <div className="container py-2 flex flex-col gap-2 min-h-[80dvh] items-center mx-auto">
            <div className="p-2 w-3/4 min-w-fit flex flex-col">
                <h1 className="text-xl md:text-3xl font-bold">Register</h1>
                <p className="text-sm md:text-lg font-medium text-muted-foreground">
                    Enter or modify your registration information for the
                    upcoming quarter.
                </p>
            </div>
        </div>
    );
}
