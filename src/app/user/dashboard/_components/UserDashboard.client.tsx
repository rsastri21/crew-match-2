"use client";

import {
    ProductionWithRoles,
    Role,
    UserWithCandidateProfile,
} from "@/db/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import AssignmentsSection from "./AssignmentsSection";
import RegistrationSection from "./RegistrationSection";
import ProductionsSection from "../../../../components/ProductionsSection";
import TopHeading from "../../../../components/TopHeading";
import { useEffect } from "react";
import posthog from "posthog-js";

export interface UserDashboardClientProps {
    user: UserWithCandidateProfile;
    assignments: Role[];
    productions: ProductionWithRoles[];
    directors: string[];
    isRegistrationOpen: boolean;
}

export default function UserDashboardClient(props: UserDashboardClientProps) {
    useEffect(() => {
        posthog.identify(props.user.id, {
            name: props.user.profile?.name,
            role: props.user.role,
        });
    }, [props.user]);

    return (
        <Tabs defaultValue="profile">
            <div className="container py-2 flex flex-col gap-2 min-h-[80dvh] items-center mx-auto">
                <div className="w-full py-6 flex flex-wrap justify-start md:justify-between items-center">
                    <TopHeading
                        text={`Welcome, ${props.user.profile!.name!}`}
                    />
                    <TabsList className="md:w-64 w-1/2 min-w-fit shadow-sm">
                        <TabsTrigger className="w-full h-full" value="profile">
                            My Information
                        </TabsTrigger>
                        <TabsTrigger
                            className="w-full h-full"
                            value="productions"
                        >
                            Productions
                        </TabsTrigger>
                    </TabsList>
                </div>
                <Separator />
                <TabsContent className="w-full" value="profile">
                    <AssignmentsSection assignments={props.assignments} />
                    <Separator />
                    <RegistrationSection
                        userInfo={props.user}
                        isRegistrationOpen={props.isRegistrationOpen}
                    />
                </TabsContent>
                <TabsContent className="w-full" value="productions">
                    <ProductionsSection
                        productions={props.productions}
                        directors={props.directors}
                    />
                </TabsContent>
            </div>
        </Tabs>
    );
}
