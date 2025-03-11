"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ClipboardCopy } from "lucide-react";
import { ReactNode } from "react";

interface RegistrationCodeCardProps {
    title: string;
    description: string;
    code: string;
    children?: ReactNode;
}

export default function RegistrationCodeCard(props: RegistrationCodeCardProps) {
    const { toast } = useToast();

    function handleCopyClick() {
        navigator.clipboard.writeText(props.code);
        toast({
            title: "Copied code to clipboard",
        });
    }

    return (
        <Card className="w-full p-4 flex flex-col gap-2">
            <CardHeader className="p-0">
                <CardTitle>{props.title}</CardTitle>
                <CardDescription>{props.description}</CardDescription>
            </CardHeader>
            {props.children}
            <section className="w-full h-16 bg-primary-foreground rounded-lg flex items-center justify-center relative">
                <span className="font-mono font-semibold text-xl tracking-widest">
                    {props.code}
                </span>
                <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-2"
                    onClick={handleCopyClick}
                >
                    <ClipboardCopy />
                </Button>
            </section>
        </Card>
    );
}
