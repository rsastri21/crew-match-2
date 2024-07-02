"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { SectionSeparator } from "../sign-in/page";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { GoogleIcon, SlackIcon } from "../auth-icons";
import { Mail } from "lucide-react";
import { btnStyles } from "@/styles/icons";

export default function SignUpPage() {
    const [role, setRole] = useState<string>("user");

    return (
        <div className="container py-24 flex min-h-[80dvh] items-center justify-center mx-auto">
            <Card className="w-1/2 min-w-fit">
                <CardHeader>
                    <CardTitle>Sign up for Crew Match</CardTitle>
                    <CardDescription>
                        Welcome! Let's get started.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h2 className="text-md font-semibold">
                                How would you like to use Crew Match?
                            </h2>
                            <Select onValueChange={setRole} defaultValue={role}>
                                <SelectTrigger className="w-full">
                                    <SelectValue defaultValue={role} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="user">
                                            Explore or join productions as a
                                            user
                                        </SelectItem>
                                        <SelectItem value="production_head">
                                            Create a production as a production
                                            head
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <SectionSeparator label="Choose a sign up option" />
                        <Link
                            href={`/api/signup/google?role=${role}`}
                            className={cn(
                                buttonVariants({ variant: "default" }),
                                "w-full"
                            )}
                        >
                            <GoogleIcon className="mr-2 h-5 w-5 invert dark:invert-0" />
                            Sign up with Google
                        </Link>
                        <Link
                            href={`/api/signup/?role=${role}`}
                            className={cn(
                                buttonVariants({ variant: "default" }),
                                "w-full"
                            )}
                        >
                            <SlackIcon className="mr-2 h-5 w-5 invert dark:invert-0" />
                            Sign up with Slack
                        </Link>
                        <Button
                            asChild
                            variant="secondary"
                            className={cn(btnStyles, "w-full")}
                        >
                            <Link href={`/sign-up/email?role=${role}`}>
                                <Mail /> Sign up with email and password
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}