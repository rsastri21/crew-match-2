import PageContainer from "@/components/PageContainer";
import TopHeading from "@/components/TopHeading";
import { getCurrentUser } from "@/lib/session";
import { getDashboardUrl } from "@/utils/redirects";
import { redirect } from "next/navigation";

export default async function AdminCandidatePage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    if (!user.isAdmin) {
        redirect(getDashboardUrl(user.role));
    }

    return (
        <PageContainer heading={<PageHeading />}>
            <h1>Page content.</h1>
        </PageContainer>
    );
}

function PageHeading() {
    return (
        <div className="w-full py-6 flex flex-col">
            <TopHeading text="Manage Candidates" />
        </div>
    );
}
