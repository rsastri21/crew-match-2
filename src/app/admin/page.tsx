import PageContainer from "@/components/PageContainer";
import TopHeading from "@/components/TopHeading";
import { Profile } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { getDashboardUrl } from "@/utils/redirects";
import { getUserProfile } from "@/utils/users";
import { redirect } from "next/navigation";
import AtAGlanceSection from "./_components/AtAGlanceSection";

export default async function AdminPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    if (!user.isAdmin) {
        redirect(getDashboardUrl(user.role));
    }

    const profile = await getUserProfile(user.id);

    return (
        <PageContainer heading={<PageHeading profile={profile} />}>
            <AtAGlanceSection />
        </PageContainer>
    );
}

function PageHeading({ profile }: { profile: Profile }) {
    return (
        <div className="w-full py-6 flex flex-col">
            <TopHeading text="Admin Home" />
            <h2 className="px-2 text-md text-muted-foreground">
                Thanks for helping run Crew Match, {profile.name!}. View quick
                information here, or take deeper administrative actions from the
                sidebar.
            </h2>
        </div>
    );
}
