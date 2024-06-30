"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { GoogleIcon, SlackIcon } from "../auth-icons";
import { MagicLinkForm } from "./magic-link-form";
import { Mail } from "lucide-react";
import { btnStyles } from "@/styles/icons";

export default function SignInPage() {
    return (
        <div className="container py-24 flex min-h-[80dvh] items-center justify-center mx-auto">
            <Card className="w-1/2 min-w-fit">
                <CardHeader>
                    <CardTitle>Sign in to Crew Match</CardTitle>
                    <CardDescription>
                        Login with one of the options below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Link
                            href="/api/login/google"
                            className={cn(
                                buttonVariants({ variant: "default" }),
                                "w-full"
                            )}
                        >
                            <GoogleIcon className="mr-2 h-5 w-5 invert dark:invert-0" />
                            Sign in with Google
                        </Link>
                        <Link
                            href="/api/login/slack"
                            className={cn(
                                buttonVariants({ variant: "default" }),
                                "w-full"
                            )}
                        >
                            <SlackIcon className="mr-2 h-5 w-5 invert dark:invert-0" />
                            Sign in with Slack
                        </Link>
                        <SectionSeparator label="Or sign in with email" />
                        <MagicLinkForm />
                        <SectionSeparator label="Other options" />
                        <div className="flex justify-center">
                            <Button
                                asChild
                                variant="ghost"
                                className={cn(btnStyles, "w-full")}
                            >
                                <Link href="/sign-in/email">
                                    <Mail /> Sign in with email and password
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function SectionSeparator({ label }: { label: string }) {
    return (
        <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="bg-gray-100 px-2 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
                    {label}
                </span>
            </div>
        </div>
    );
}
