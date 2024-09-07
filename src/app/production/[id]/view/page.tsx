import ProductionMemberCard from "@/components/ProductionMemberCard";
import ProductionSubInfoCard from "@/components/ProductionSubInfoCard";
import TopHeading from "@/components/TopHeading";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { mockProductionsWithRoles } from "@/data/constants";
import { getProductionWithRoles } from "@/data/productions";
import { getProductionDirectorName } from "@/data/roles";
import { getCurrentUser } from "@/lib/session";
import { cn } from "@/lib/utils";
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

    if (!production) {
        return (
            <div className="container py-2 flex flex-col gap-2 min-h-[80dvh] items-center mx-auto">
                <section className="w-full py-6 flex flex-wrap justify-center items-center">
                    <TopHeading text="The requested production does not exist." />
                </section>
            </div>
        );
    }

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
        <div className="container py-2 flex flex-col gap-2 min-h-[80dvh] items-center mx-auto">
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
                    <Button>I&apos;m interested</Button>
                </div>
            </section>
            <Separator />
            <div className="w-full h-[60dvh] mt-8 overflow-y-scroll grid grid-cols-1 lg:grid-cols-2 gap-4">
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
        </div>
    );
}
