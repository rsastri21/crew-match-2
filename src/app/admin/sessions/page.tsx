import PageContainer from "@/components/PageContainer";
import TopHeading from "@/components/TopHeading";
import { getCurrentUser } from "@/lib/session";
import { getDashboardUrl } from "@/utils/redirects";
import { redirect } from "next/navigation";
import RegistrationCodeCard from "./_components/RegistrationCodeCard";
import { getSessionCodes } from "@/data/configs";

export default async function AdminSessionPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    if (!user.isAdmin) {
        redirect(getDashboardUrl(user.role));
    }

    const { candidate, production } = await getSessionCodes();

    return (
        <PageContainer heading={<PageHeading />}>
            <RegistrationCodeCard
                title="Candidate Registration"
                description="Provide the code below to users to allow them to register
                    this quarter."
                code={candidate}
            />
            <RegistrationCodeCard
                title="Production Creation"
                description="Provide the code below to production heads to allow them to create a production
                    this quarter."
                code={production}
            />
        </PageContainer>
    );
}

function PageHeading() {
    return (
        <div className="w-full pt-6 flex flex-col">
            <TopHeading text="Manage Sessions" />
        </div>
    );
}
