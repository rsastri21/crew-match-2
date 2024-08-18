"use client";

import { Role, UserWithCandidateProfile } from "@/db/schema";
import UserWelcomeHeading from "./UserWelcomeHeading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import AssignmentsSection from "./AssignmentsSection";
import RegistrationSection from "./RegistrationSection";

const mockUser: UserWithCandidateProfile = {
    id: "testId",
    role: "user",
    candidate: {
        id: 0,
        name: "Rohan Sastri",
        userId: "testId",
        yearsInUW: 4,
        quartersInLUX: 12,
        isActing: false,
        prioritizeProductions: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        interestedProductions: ["Pink Robots", "Dead Serious", "The Grudge"],
        interestedRoles: [
            "Editor",
            "Director",
            "Director of Photography",
            "Producer",
        ],
    },
    profile: {
        id: 0,
        userId: "testId",
        name: "Rohan Sastri",
        imageId: null,
        pronouns: "he/him",
        image: "test",
    },
    email: "rsastri21@gmail.com",
    emailVerified: null,
};

export interface UserDashboardClientProps {
    user: UserWithCandidateProfile;
    assignments: Role[];
}

export default function UserDashboardClient(props: UserDashboardClientProps) {
    return (
        <Tabs defaultValue="profile">
            <div className="container py-2 flex flex-col gap-2 min-h-[80dvh] items-center mx-auto">
                <div className="w-full py-6 flex flex-wrap justify-start md:justify-between items-center">
                    <UserWelcomeHeading name={props.user.profile!.name!} />
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
                    <RegistrationSection {...props.user} />
                </TabsContent>
            </div>
        </Tabs>
    );
}
