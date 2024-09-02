import { Card } from "@/components/ui/card";

interface ProductionSubInfoCardProps {
    title: string;
    contents: string;
}

export default function ProductionSubInfoCard({
    title,
    contents,
}: ProductionSubInfoCardProps) {
    return (
        <Card className="w-full h-1/3 mx-auto flex flex-col gap-4 border p-4">
            <h1 className="font-medium text-base">{title}</h1>
            <p className="text-sm text-muted-foreground overflow-y-scroll">
                {contents}
            </p>
        </Card>
    );
}
