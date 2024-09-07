import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { VARIANTS, variant } from "@/data/constants";
import { RoleWithCandidateName } from "@/db/schema";

interface ProductionMemberCardProps {
    type: "Crew" | "Cast";
    roles: RoleWithCandidateName[];
    variant: variant;
}

interface ProductionMemberRowProps {
    role: string;
    member: string;
    variant: variant;
}

export default function ProductionMemberCard(props: ProductionMemberCardProps) {
    const sizeConfig = VARIANTS[props.variant];

    return (
        <Card className="w-full h-full mx-auto flex flex-col gap-4 border p-4">
            <h1 className={`font-medium ${sizeConfig.heading}`}>
                {props.type}
            </h1>
            <section className="w-full flex flex-col gap-2 overflow-y-scroll">
                <div className="w-full flex items-center justify-between">
                    <h3
                        className={`${sizeConfig.paragraph} text-muted-foreground font-medium`}
                    >
                        Role
                    </h3>
                    <h3
                        className={`${sizeConfig.paragraph} text-muted-foreground font-medium`}
                    >
                        Member
                    </h3>
                </div>
                <Separator />
                {props.roles.map((role, index) => (
                    <div
                        key={`${role.role}_${role.production}_${role.id}`}
                        className="w-full flex flex-col gap-2"
                    >
                        <ProductionMemberRow
                            role={role.role}
                            member={role.candidate?.name ?? ""}
                            variant={props.variant}
                        />
                        {index !== props.roles.length - 1 && <Separator />}
                    </div>
                ))}
            </section>
        </Card>
    );
}

function ProductionMemberRow(props: ProductionMemberRowProps) {
    const sizeConfig = VARIANTS[props.variant];

    return (
        <div className="w-full flex items-center justify-between">
            <h3 className={`${sizeConfig.paragraph} font-medium`}>
                {props.role}
            </h3>
            <h3 className={`${sizeConfig.paragraph} font-medium`}>
                {props.member}
            </h3>
        </div>
    );
}
