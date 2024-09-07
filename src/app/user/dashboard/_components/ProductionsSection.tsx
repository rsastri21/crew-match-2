import SectionHeading from "@/components/SectionHeading";
import { ProductionWithRoles, RoleWithCandidateName } from "@/db/schema";
import ProductionInfoCard from "./ProductionInfoCard";
import { Separator } from "@/components/ui/separator";
import ProductionOverviewCard from "./production-information/ProductionOverviewCard";
import { useState } from "react";
import useWindowSize from "@/hooks/useWindowSize";
import { useRouter } from "next/navigation";

export function getAmountFilled(roles: RoleWithCandidateName[]): {
    filled: number;
    total: number;
} {
    const total = roles.length;
    let filled: number = 0;

    for (const role of roles) {
        if (role.candidateId) {
            filled += 1;
        }
    }

    return { filled, total };
}

export default function ProductionsSection({
    productions,
    directors,
}: {
    productions: ProductionWithRoles[];
    directors: string[];
}) {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [windowWidth, windowHeight] = useWindowSize();
    const router = useRouter();
    const isSmallFormatDisplay = windowWidth <= 768;

    const handleSelectProduction = (index: number) => {
        setSelectedIndex(index);
    };

    const handleSelectProductionSmallWindow = (id: number) => {
        router.push(`/production/${id}/view`);
    };

    return (
        <section className="w-full flex flex-col gap-4 md:justify-center items-center">
            <div className="w-full flex justify-start">
                <SectionHeading title="View Productions" />
            </div>
            {productions.length === 0 ? (
                <h1 className="text-lg font-light text-muted-foreground w-fit h-fit">
                    No productions to display.
                </h1>
            ) : (
                <div className="w-full h-[600px] max-h-[600px] flex gap-4">
                    <div className="w-full md:w-80 md:min-w-80 px-1 flex flex-col gap-4">
                        {productions.map((production, index) => (
                            <ProductionInfoCard
                                key={`${production.name}-${production.createdAt}`}
                                productionName={production.name}
                                director={directors[index] ?? ""}
                                capacity={getAmountFilled(production.roles)}
                                id={
                                    isSmallFormatDisplay ? production.id : index
                                }
                                selectProduction={
                                    isSmallFormatDisplay
                                        ? handleSelectProductionSmallWindow
                                        : handleSelectProduction
                                }
                                isSelected={
                                    isSmallFormatDisplay
                                        ? false
                                        : index === selectedIndex
                                }
                            />
                        ))}
                    </div>
                    <Separator
                        orientation="vertical"
                        className="hidden md:block"
                    />
                    <div className="w-full px-1 hidden md:block">
                        <ProductionOverviewCard
                            production={productions[selectedIndex]}
                            director={directors[selectedIndex]}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
