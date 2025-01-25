import PageContainer from "@/components/PageContainer";
import TopHeading from "@/components/TopHeading";
import { getCurrentUser } from "@/lib/session";
import { getDashboardUrl } from "@/utils/redirects";
import { redirect } from "next/navigation";
import CandidateUploadCard from "./_components/CandidateUploadCard";
import { getAllCandidates } from "@/data/candidates";
import { DataTable } from "@/components/ui/data-table";
import { candidateTableColumnFactory } from "./_components/candidates-table/columns";
import { transformCandidatesToRowModel } from "@/utils/candidates";

export default async function AdminCandidatePage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    if (!user.isAdmin) {
        redirect(getDashboardUrl(user.role));
    }

    const candidates = await getAllCandidates();
    const rowCandidates = transformCandidatesToRowModel(candidates);

    return (
        <PageContainer heading={<PageHeading />}>
            <DataTable
                columnGenerator={candidateTableColumnFactory}
                user={user}
                data={rowCandidates}
            />
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
