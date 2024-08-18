import { getCurrentUser } from "@/lib/session";
import {
    getCandidatesWithEditDistance,
    getCandidatesWithSimilarName,
} from "@/utils/candidates";
import { getUserCandidateProfile, getUserProfile } from "@/utils/users";
import { redirect } from "next/navigation";
import CandidateDiscover from "./_components/CandidateDiscover.client";

export default async function CandidateDiscoverPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const userInfo = await getUserCandidateProfile(user.id);
    if (userInfo.candidate) {
        redirect("/candidate/register");
    }
    const profile = userInfo.profile!;

    const similarCandidates = await getCandidatesWithSimilarName(
        profile.name ?? ""
    );

    if (similarCandidates.length === 0) {
        redirect("/candidate/register");
    }

    const similarCandidatesWithinEditDistance = getCandidatesWithEditDistance(
        profile.name!,
        2,
        similarCandidates
    );

    if (similarCandidatesWithinEditDistance.length === 0) {
        redirect("/candidate/register");
    }

    return (
        <div className="container py-2 flex flex-col gap-2 min-h-[80dvh] items-center mx-auto">
            <div className="px-2 py-4 w-full md:w-3/4 flex flex-col">
                <h1 className="text-3xl font-bold">Discover</h1>
                <p className="text-lg font-medium text-muted-foreground">
                    Some registered candidates with similar names are already
                    present. If one of these are you, select it to associate it
                    with your profile.
                </p>
            </div>
            <CandidateDiscover
                candidates={similarCandidatesWithinEditDistance}
                profile={profile}
            />
        </div>
    );
}
