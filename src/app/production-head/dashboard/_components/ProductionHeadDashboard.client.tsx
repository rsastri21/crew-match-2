"use client";

import TopHeading from "@/components/TopHeading";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductionWithRoles, UserWithCandidateProfile } from "@/db/schema";
import MyProductionSection from "./MyProductionSection";
import ProductionsSection from "@/components/ProductionsSection";
import { CandidateRow } from "@/data/candidates";
import { useEffect } from "react";
import posthog from "posthog-js";

export interface ProductionHeadDashboardClientProps {
    user: UserWithCandidateProfile;
    productions: ProductionWithRoles[];
    candidates: CandidateRow[];
    directors: string[];
    isProductionCreationAvailable: boolean;
}

export default function ProductionHeadDashboardClient(
    props: ProductionHeadDashboardClientProps
) {
    const index = props.productions.findIndex(
        (production) => production.userId === props.user.id
    );
    const production = index !== -1 ? props.productions[index] : undefined;
    const director = index !== -1 ? props.directors[index] : undefined;
    const {
        candidate,
        production: userProduction,
        profile,
        ...user
    } = props.user;

    useEffect(() => {
        posthog.identify(user.id, { name: profile?.name, role: user.role });
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
                            My Production
                        </TabsTrigger>
                        <TabsTrigger
                            className="w-full h-full"
                            value="productions"
                        >
                            All Productions
                        </TabsTrigger>
                    </TabsList>
                </div>
                <Separator />
                <TabsContent className="w-full" value="profile">
                    <MyProductionSection
                        production={production}
                        director={director}
                        candidates={props.candidates}
                        user={user}
                        isProductionCreationAvailable={
                            props.isProductionCreationAvailable
                        }
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
