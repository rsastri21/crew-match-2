import { Card, CardContent } from "@/components/ui/card";
import { ProductionWithRoles } from "@/db/schema";
import ProductionInformationHeader from "./ProductionInformationHeader";
import ProductionSubInfoCard from "../../../../../components/ProductionSubInfoCard";
import ProductionMemberCard from "../../../../../components/ProductionMemberCard";

export interface ProductionOverviewCardProps {
    production: ProductionWithRoles;
    director: string;
}

export default function ProductionOverviewCard(
    props: ProductionOverviewCardProps
) {
    const productionSubInfoMap = [
        {
            title: "Logline",
            contents: props.production.logline,
        },
        {
            title: "Logistics",
            contents: props.production.logistics,
        },
        {
            title: "Who I'm Looking For",
            contents: props.production.lookingFor,
        },
    ];

    return (
        <Card className="w-full h-full max-h-[600px] mx-auto flex flex-col gap-4 border p-4 shadow-md">
            <ProductionInformationHeader
                name={props.production.name}
                director={props.director}
                pitchLink={props.production.pitchLink}
                id={props.production.id}
            />
            <CardContent className="w-full h-full overflow-y-scroll grid grid-cols-1 lg:grid-cols-2 gap-2 p-0">
                <div className="w-full col-span-1 flex flex-col gap-2">
                    {productionSubInfoMap.map((productionSubInfo) => (
                        <ProductionSubInfoCard
                            key={productionSubInfo.title}
                            title={productionSubInfo.title}
                            contents={productionSubInfo.contents}
                            variant="small"
                        />
                    ))}
                </div>
                <div className="w-full col-span-1">
                    <ProductionMemberCard
                        type="Crew"
                        roles={props.production.roles}
                        variant="small"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
