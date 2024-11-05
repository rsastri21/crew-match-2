import SectionHeading from "@/components/SectionHeading";
import AtAGlanceCard, { AtAGlanceCardProps } from "./AtAGlanceCard";
import { getCandidateCount } from "@/data/candidates";
import { BookUser, Clapperboard, Users } from "lucide-react";
import { getUserCount } from "@/data/users";
import { getProductionCount } from "@/data/productions";

const CARDS: AtAGlanceCardProps[] = [
    {
        Icon: Users,
        label: "Users",
        getData: getUserCount,
    },
    {
        Icon: BookUser,
        label: "Candidates",
        getData: getCandidateCount,
    },
    {
        Icon: Clapperboard,
        label: "Productions",
        getData: getProductionCount,
    },
];

export default function AtAGlanceSection() {
    return (
        <div className="w-full flex flex-col gap-2 md:justify-center items-center">
            <div className="w-full flex justify-start">
                <SectionHeading title="At a Glance" />
            </div>
            <div className="w-full h-fit flex flex-wrap justify-start gap-4 p-2">
                {CARDS.map((card) => (
                    <AtAGlanceCard {...card} key={card.label} />
                ))}
            </div>
        </div>
    );
}
