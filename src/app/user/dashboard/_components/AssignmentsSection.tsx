import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Role } from "@/db/schema";
import SectionHeading from "../../../../components/SectionHeading";
import SectionRow from "../../../../components/SectionRow";
import { getCandidateAssignments } from "@/data/candidates";
import { getCurrentUser } from "@/lib/session";

export default function AssignmentsSection({
    assignments,
}: {
    assignments: Role[];
}) {
    return (
        <div className="w-full flex flex-col gap-2 pb-6 md:justify-center items-center">
            <div className="w-full flex justify-start">
                <SectionHeading title="My Assignments" />
            </div>
            <SectionRow<Role>
                data={assignments}
                blankText="No assignments to display."
                sectionCard={AssignmentCard}
            />
        </div>
    );
}

function AssignmentCard(assignment: Role) {
    return (
        <Card className="md:w-64 w-full shadow-md">
            <CardHeader className="p-4">
                <p className="font-semibold text-md">{assignment.production}</p>
            </CardHeader>
            <CardContent className="px-4 flex flex-col gap-4">
                <p className="md:text-2xl text-lg font-semibold bg-emerald-100 dark:bg-emerald-800 p-2 w-fit h-fit rounded-lg">
                    {assignment.role}
                </p>
                <p className="text-xs font-light text-muted-foreground w-fit h-fit">
                    Click to view this production&apos;s page
                </p>
            </CardContent>
        </Card>
    );
}
