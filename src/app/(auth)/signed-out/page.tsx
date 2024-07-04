"use client";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
                    Successfully signed out!
                </div>
                <div className="font-light md:text-4xl py-4 text-secondary-foreground">
                    Thanks for using Crew Match
                </div>
            </div>
        </AuroraBackground>
    );
}
