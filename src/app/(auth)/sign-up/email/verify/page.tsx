"use client";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignedOutPage() {
    const router = useRouter();
    useEffect(() => {
        router.refresh();
    }, [router]);

    return (
        <AuroraBackground className="gap-8">
            <div className="flex flex-col justify-center items-center">
                <div className="text-xl md:text-7xl font-bold text-center text-primary">
                    Verify your Email
                </div>
                <div className="font-light md:text-4xl py-4 text-secondary-foreground">
                    Check your inbox for a message to verify your email
                </div>
            </div>
        </AuroraBackground>
    );
}
