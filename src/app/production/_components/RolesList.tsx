"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Roles } from "@/utils/types";
import { CircleMinus } from "lucide-react";

interface RolesListComponentProps {
    roles: Roles[];
    removeRole: (role: Roles, index: number) => void;
    dropCandidate: (index: number) => void;
}

export default function RolesListComponent({
    roles,
    removeRole,
    dropCandidate,
}: RolesListComponentProps) {
    return (
        <section className="flex flex-col gap-4 max-h-[50dvh] overflow-y-scroll">
            {roles.map((role, index) => (
                <Card className="p-4" key={`${role.id}_${index}`}>
                    <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <section className="w-fit h-full space-x-4 flex items-center">
                            <h2 className="text-medium font-semibold">
                                {role.role}
                            </h2>
                            {role.candidate ? (
                                <Badge>{role.candidate.name}</Badge>
                            ) : null}
                        </section>
                        <section className="w-full md:w-fit h-full space-x-2 flex items-center">
                            {role.candidateId && (
                                <Button
                                    variant="outline"
                                    type="button"
                                    className="w-full"
                                    onClick={() => dropCandidate(index)}
                                >
                                    <CircleMinus /> Drop
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                type="button"
                                className="w-full"
                                onClick={() => removeRole(role, index)}
                            >
                                <CircleMinus /> Remove
                            </Button>
                        </section>
                    </div>
                </Card>
            ))}
        </section>
    );
}
