import PageContainer from "@/components/PageContainer";
import TopHeading from "@/components/TopHeading";
import { getCurrentUser } from "@/lib/session";
import { getDashboardUrl } from "@/utils/redirects";
import { redirect } from "next/navigation";
import RegistrationCodeCard from "./_components/RegistrationCodeCard";
import {
    getCandidateRegistrationStatus,
    getProductionCreationStatus,
    getSessionCodes,
} from "@/data/configs";
import {
    CandidateRegistrationSwitch,
    ProductionCreationSwitch,
} from "./_components/RegistrationSwitches";
import NewSessionCard from "./_components/NewSessionCard";

export default async function AdminSessionPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    if (!user.isAdmin) {
        redirect(getDashboardUrl(user.role));
    }

    const { candidate, production } = await getSessionCodes();
    const [candidateRegistration, productionCreation] = await Promise.all([
        getCandidateRegistrationStatus(),
        getProductionCreationStatus(),
    ]);

    return (
        <PageContainer heading={<PageHeading />}>
            <RegistrationCodeCard
                title="Candidate Registration"
                description="Provide the code below to users to allow them to register
                    this quarter."
                code={candidate}
            >
                <CandidateRegistrationSwitch enabled={candidateRegistration} />
            </RegistrationCodeCard>
            <RegistrationCodeCard
                title="Production Creation"
                description="Provide the code below to production heads to allow them to create a production
                    this quarter."
                code={production}
            >
                <ProductionCreationSwitch enabled={productionCreation} />
            </RegistrationCodeCard>
            <NewSessionCard />
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
