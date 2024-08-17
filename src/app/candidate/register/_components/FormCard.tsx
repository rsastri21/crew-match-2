import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ReactNode } from "react";

interface FormCardProps {
    title: string;
    description: string;
    children: ReactNode;
}

export default function FormCard({
    title,
    description,
    children,
}: FormCardProps) {
    return (
        <Card className="w-full md:w-3/4 mx-auto">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {children}
            </CardContent>
        </Card>
    );
}
