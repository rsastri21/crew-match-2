"use client";

import {
    candidateFilters,
    candidateTableColumnFactory,
} from "@/components/candidates-table/columns";
import ProductionInfoCard from "@/components/ProductionInfoCard";
import SectionHeading from "@/components/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { CandidateRow } from "@/data/candidates";
import type { ProductionWithRoles, User } from "@/db/schema";
import { cn } from "@/lib/utils";
import { getAmountFilled } from "@/utils/productionClientUtils";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface MyProductionSectionProps {
    production: ProductionWithRoles | undefined;
    candidates: CandidateRow[];
    director: string | undefined;
    user: User;
}

export default function MyProductionSection(props: MyProductionSectionProps) {
    const router = useRouter();

    const handleClickProduction = (id: number) => {
        router.push(`/production/${id}/view`);
    };

    return (
        <div className="w-full flex flex-col gap-2 pb-6 md:justify-center items-center">
            <div className="w-full flex justify-between items-center">
                <SectionHeading title="My Production" />
                {!props.production && (
                    <Link
                        href="/production/create"
                        className={cn(
                            buttonVariants({ variant: "default" }),
                            "w-fit"
                        )}
                    >
                        Create Production
                    </Link>
                )}
            </div>
            {props.production ? (
                <div className="w-full px-2 pb-2">
                    <ProductionInfoCard
                        productionName={props.production.name}
                        director={props.director!}
                        capacity={getAmountFilled(props.production.roles)}
                        id={props.production.id}
                        selectProduction={handleClickProduction}
                        isSelected={false}
                    />
                </div>
            ) : (
                <h1 className="text-lg font-light text-muted-foreground w-fit h-fit">
                    No production created.
                </h1>
            )}
            <div className="w-full flex flex-col gap-2 justify-between items-center">
                <section className="w-full flex items-center">
                    <SectionHeading title="Candidates" />
                </section>
                <section className="px-2 py-1 max-w-full w-full overflow-x-scroll">
                    <DataTable
                        columnGenerator={candidateTableColumnFactory}
                        user={props.user}
                        data={props.candidates}
                        filters={candidateFilters}
                    />
                </section>
            </div>
        </div>
    );
}
