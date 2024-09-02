import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RoleWithCandidateName } from "@/db/schema";

interface ProductionMemberCardProps {
    type: "Crew" | "Cast";
    roles: RoleWithCandidateName[];
}

interface ProductionMemberRowProps {
    role: string;
    member: string;
}

export default function ProductionMemberCard(props: ProductionMemberCardProps) {
    return (
        <Card className="w-full h-full mx-auto flex flex-col gap-4 border p-4">
            <h1 className="font-medium text-base">{props.type}</h1>
            <section className="w-full flex flex-col gap-2 overflow-y-scroll">
                <div className="w-full flex items-center justify-between">
                    <h3 className="text-sm text-muted-foreground font-medium">
                        Role
                    </h3>
                    <h3 className="text-sm text-muted-foreground font-medium">
                        Member
                    </h3>
                </div>
                <Separator />
                {props.roles.map((role, index) => (
                    <div className="w-full flex flex-col gap-2">
                        <ProductionMemberRow
                            key={role.role + role.id}
                            role={role.role}
                            member={role.candidate?.name ?? ""}
                        />
                        {index !== props.roles.length - 1 && <Separator />}
                    </div>
                ))}
            </section>
        </Card>
    );
}

function ProductionMemberRow(props: ProductionMemberRowProps) {
    return (
        <div className="w-full flex items-center justify-between">
            <h3 className="text-sm font-medium">{props.role}</h3>
            <h3 className="text-sm font-medium">{props.member}</h3>
        </div>
    );
}
