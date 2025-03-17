import CandidateQuickCreate from "@/components/candidate-quick-add/CandidateQuickCreate";
import {
    candidateFilters,
    candidateTableColumnFactory,
} from "@/components/candidates-table/columns";
import ProductionMemberCard from "@/components/ProductionMemberCard";
import ProductionSubInfoCard from "@/components/ProductionSubInfoCard";
import SectionHeading from "@/components/SectionHeading";
import TopHeading from "@/components/TopHeading";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { getAllCandidates } from "@/data/candidates";
import { getProductionWithRoles } from "@/data/productions";
import { getProductionDirectorName } from "@/data/roles";
import { getCurrentUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { transformCandidatesToRowModel } from "@/utils/candidates";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ViewProductionPage({
    params,
}: {
    params: { id: number };
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const production = await getProductionWithRoles(params.id);
    const director = await getProductionDirectorName(params.id);
    const candidates = await getAllCandidates();
    const rowCandidates = transformCandidatesToRowModel(candidates);

    if (!production) {
        return (
            <div className="container py-2 flex flex-col gap-2 min-h-[80dvh] items-center mx-auto">
                <section className="w-full py-6 flex flex-wrap justify-center items-center">
                    <TopHeading text="The requested production does not exist." />
                </section>
            </div>
        );
    }

    const isProductionLeader = production.userId === user.id;

    const productionSubInfoMap = [
        {
            title: "Logline",
            contents: production.logline,
        },
        {
            title: "Logistics",
            contents: production.logistics,
        },
        {
            title: "Who I'm Looking For",
            contents: production.lookingFor,
        },
    ];

    return (
        <div className="container py-2 flex flex-col gap-2 h-fit items-center mx-auto">
            <section className="w-full py-6 flex flex-col md:flex-row gap-4 justify-center md:justify-between items-center">
                <div className="w-fit flex items-center justify-center space-x-2">
                    <TopHeading text={production.name} />
                    {director ? (
                        <Badge className="text-center">{`Directed by: ${director}`}</Badge>
                    ) : null}
                </div>
                <div className="w-fit flex justify-center gap-2">
                    <Link
                        href={production.pitchLink}
                        className={cn(
                            buttonVariants({ variant: "secondary" }),
                            "w-fit"
                        )}
                    >
                        View pitch
                    </Link>
                    {isProductionLeader ? (
                        <Link
                            href={`/production/${production.id}/edit`}
                            className={cn(
                                buttonVariants({ variant: "default" }),
                                "w-fit"
                            )}
                        >
                            Edit
                        </Link>
                    ) : null}
                </div>
            </section>
            <Separator />
            <div className="px-2 w-full h-fit my-4 overflow-y-scroll grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="w-full col-span-1 flex flex-col gap-4">
                    {productionSubInfoMap.map((productionSubInfo) => (
                        <ProductionSubInfoCard
                            key={productionSubInfo.title}
                            title={productionSubInfo.title}
                            contents={productionSubInfo.contents}
                            variant="large"
                        />
                    ))}
                </div>
                <div className="w-full col-span-1">
                    <ProductionMemberCard
                        type="Crew"
                        roles={production.roles}
                        variant="large"
                    />
                </div>
            </div>
            {(isProductionLeader || user.isAdmin) && (
                <div className="w-full flex flex-col gap-2 justify-between items-center">
                    <section className="w-full flex items-center">
                        <SectionHeading title="Candidates" />
                    </section>
                    <section className="px-2 py-1 max-w-full w-full overflow-x-scroll">
                        <DataTable
                            columnGenerator={candidateTableColumnFactory}
                            user={user}
                            data={rowCandidates}
                            filters={candidateFilters}
                        />
                    </section>
                    <CandidateQuickCreate roles={production.roles} />
                </div>
            )}
        </div>
    );
}
