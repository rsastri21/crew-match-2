import { Card } from "@/components/ui/card";
import { BookUser, Loader2Icon, LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes, Suspense } from "react";

export interface AtAGlanceCardProps {
    Icon: ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    label: string;
    getData: () => Promise<{ count: number }[]>;
}

export default async function AtAGlanceCard({
    Icon,
    label,
    getData,
}: AtAGlanceCardProps) {
    return (
        <Card className="w-full md:flex-1 min-w-fit h-16 shadow-md p-4">
            <div className="w-full flex justify-between items-center space-x-2">
                <span className="flex gap-2 items-center">
                    <Icon className="w-6 h-6" />
                    <h1 className="text-xl font-medium">{label}</h1>
                </span>
                <Suspense
                    fallback={<Loader2Icon className="animate-spin w-6 h-6" />}
                >
                    <CountComponent getData={getData} />
                </Suspense>
            </div>
        </Card>
    );
}

async function CountComponent({
    getData,
}: {
    getData: () => Promise<{ count: number }[]>;
}) {
    const [count] = await getData();
    return <h1 className="text-xl font-semibold">{count.count}</h1>;
}
