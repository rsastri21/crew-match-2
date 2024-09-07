import { Card } from "@/components/ui/card";
import { VARIANTS, variant } from "@/data/constants";

interface ProductionSubInfoCardProps {
    title: string;
    contents: string;
    variant: variant;
}

export default function ProductionSubInfoCard({
    title,
    contents,
    variant,
}: ProductionSubInfoCardProps) {
    const sizeConfig = VARIANTS[variant];

    return (
        <Card className="w-full h-1/3 mx-auto flex flex-col gap-4 border p-4">
            <h1 className={`font-medium ${sizeConfig.heading}`}>{title}</h1>
            <p
                className={`${sizeConfig.paragraph} text-muted-foreground overflow-y-scroll`}
            >
                {contents}
            </p>
        </Card>
    );
}
