import { FileUploader } from "@/components/FileUploader";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function CandidateUploadCard() {
    return (
        <Card className="w-full mx-auto">
            <CardHeader>
                <CardTitle>Upload Candidates by CSV</CardTitle>
                <CardDescription>
                    Import candidates from the results of a role interest
                    survey. This should be used as a fallback to having
                    candidates register themselves.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <FileUploader maxFileCount={1} maxSize={1024 * 200} />
            </CardContent>
        </Card>
    );
}
