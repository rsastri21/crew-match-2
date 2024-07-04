import HomePage from "@/components/home-page";
import { getCurrentUser } from "@/lib/session";
import { getUserProfile } from "@/utils/users";
import { cache } from "react";

const profileLoader = cache(getUserProfile);

export default async function Home() {
    const user = await getCurrentUser();
    let profile;
    if (user) {
        profile = await profileLoader(user.id);
    }

    return <HomePage profile={profile} />;
}
