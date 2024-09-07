import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import useWindowSize from "@/hooks/useWindowSize";
import { ChevronRight, ExternalLink } from "lucide-react";

export interface ProductionInfoCardProps {
    productionName: string;
    director: string;
    capacity: { filled: number; total: number };
    id: number;
    selectProduction: (id: number) => void;
    isSelected: boolean;
}

export default function ProductionInfoCard(props: ProductionInfoCardProps) {
    const [windowWidth, windowHeight] = useWindowSize();
    const productionFillValue =
        (props.capacity.filled / props.capacity.total) * 100;

    return (
        <Card
            className={`w-full mx-auto flex flex-col gap-4 border p-4 shadow-md hover:cursor-pointer ${
                props.isSelected ? "border-slate-800 dark:border-slate-200" : ""
            }`}
            onClick={() => props.selectProduction(props.id)}
        >
            <div className="w-full flex items-center justify-between">
                <div className="space-y-0.5">
                    <h1 className="text-lg font-semibold">
                        {props.productionName}
                    </h1>
                    {props.director.length ? (
                        <p className="text-muted-foreground text-sm font-medium">
                            Directed by: {props.director}
                        </p>
                    ) : (
                        <></>
                    )}
                </div>
                {windowWidth <= 768 ? (
                    <ExternalLink className="w-6 h-6" />
                ) : (
                    <ChevronRight className="w-6 h-6" />
                )}
            </div>
            <div className="w-full">
                <p className="text-xs text-muted-foreground p-0.5">
                    {props.capacity.filled} of {props.capacity.total} roles
                    filled
                </p>
                <Progress value={productionFillValue} />
            </div>
        </Card>
    );
}
