import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SectionHeading from "./SectionHeading";
import SectionRow from "../SectionRow";
import { UserWithCandidateProfile } from "@/db/schema";

interface CardRow {
    label: string;
    value: string;
}

interface RegistrationCardProps {
    title: string;
    content: CardRow[];
}

export default function RegistrationSection(
    userInfo: UserWithCandidateProfile
) {
    const registrationData: RegistrationCardProps[] = [
        {
            title: "Basic Information",
            content: [
                {
                    label: "Pronouns",
                    value: userInfo.profile?.pronouns ?? "Not set",
                },
                {
                    label: "Years at UW",
                    value: userInfo.candidate?.yearsInUW?.toString() ?? "N/A",
                },
                {
                    label: "Quarters in LUX",
                    value:
                        userInfo.candidate?.quartersInLUX?.toString() ?? "N/A",
                },
            ],
        },
        {
            title: "Role Preferences",
            content:
                userInfo.candidate?.interestedRoles?.map((role, index) => ({
                    label: `${convertNumberToOrdinal(index + 1)} Choice`,
                    value: role,
                })) || [],
        },
        {
            title: "Production Preferences",
            content:
                userInfo.candidate?.interestedProductions?.map(
                    (production, index) => ({
                        label: `${convertNumberToOrdinal(index + 1)} Choice`,
                        value: production,
                    })
                ) || [],
        },
        {
            title: "Member Information",
            content: [
                {
                    label: "Cast or Crew",
                    value: userInfo.candidate?.isActing ? "Cast" : "Crew",
                },
                {
                    label: "Prefer Roles or Productions",
                    value: userInfo.candidate?.prioritizeProductions
                        ? "Productions"
                        : "Roles",
                },
            ],
        },
    ];

    return (
        <div className="w-full flex flex-col gap-2 py-4 md:justify-center items-center">
            <SectionHeading title="Registration Information" />
            <SectionRow<RegistrationCardProps>
                data={userInfo.candidate ? registrationData : []}
                blankText="Not yet registered."
                sectionCard={RegistrationCard}
            />
        </div>
    );
}

function RegistrationCard({ title, content }: RegistrationCardProps) {
    return (
        <Card className="w-full md:w-64 h-52 shadow-md">
            <CardHeader className="p-4 h-fit">
                <h1 className="font-semibold text-md">{title}</h1>
            </CardHeader>
            <CardContent className="px-4 max-h-36 overflow-y-scroll">
                <ul className="flex flex-col gap-2">
                    {content.map((row, index) => (
                        <li key={index} className="flex justify-between py-2">
                            <p className="text-xs font-medium">{row.label}</p>
                            <p className="text-xs font-light">{row.value}</p>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}

function convertNumberToOrdinal(numToConvert: number) {
    const numString = numToConvert.toString();
    let output;

    if (numString.endsWith("1")) {
        output = numString + "st";
    } else if (numString.endsWith("2")) {
        output = numString + "nd";
    } else if (numString.endsWith("3")) {
        output = numString + "rd";
    } else {
        output = numString + "th";
    }

    return output;
}