import { getCurrentUser } from "@/lib/session";
import { getUserCandidateProfile } from "@/utils/users";
import { redirect } from "next/navigation";
import CandidateRegistration from "./_components/CandidateRegistration.client";

const testProductions: string[] = ["Pink Robots", "Dead Serious", "The Grudge"];

export default async function CandidateRegistrationPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const userInfo = await getUserCandidateProfile(user.id);

    return (
        <div className="container py-2 flex flex-col gap-2 items-center mx-auto">
            <div className="px-2 py-4 w-full md:w-3/4 flex flex-col">
                <h1 className="text-3xl font-bold">Register</h1>
                <p className="text-lg font-medium text-muted-foreground">
                    Enter or modify your registration information for the
                    upcoming quarter.
                </p>
            </div>
            <CandidateRegistration
                userInfo={userInfo}
                productions={testProductions}
            />
        </div>
    );
}
