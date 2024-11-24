import FormCard from "@/components/FormCard";
import PageContainer from "@/components/PageContainer";
import TopHeading from "@/components/TopHeading";
import { getCurrentUser } from "@/lib/session";
import { getDashboardUrl } from "@/utils/redirects";
import { redirect } from "next/navigation";
import CandidateUploadCard from "./_components/CandidateUploadCard";

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
            <CandidateUploadCard />
        </PageContainer>
    );
}

function PageHeading() {
    return (
        <div className="w-full pt-6 flex flex-col">
            <TopHeading text="Manage Candidates" />
        </div>
    );
}
