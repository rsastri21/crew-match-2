import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ComponentProps, ReactNode } from "react";

interface FormCardProps {
    title: string;
    description: string;
    children: ReactNode;
    className?: ComponentProps<"div">["className"];
}

export default function FormCard({
    title,
    description,
    className,
    children,
}: FormCardProps) {
    return (
        <Card className={cn("w-full md:w-3/4 mx-auto", className)}>
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
