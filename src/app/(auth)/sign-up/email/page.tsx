"use client";

import { z } from "zod";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useServerAction } from "zsa-react";
import { signUpAction } from "./actions";
import { LoaderButton } from "@/components/loader-button";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { Terminal } from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export const signUpRolesEnum = z.enum(["user", "production_head"]);
type SignUpRoles = z.infer<typeof signUpRolesEnum>;

const registrationSchema = z
    .object({
        name: z.string().min(1, { message: "Name is required." }),
        email: z.string().email(),
        password: z.string().min(8),
        passwordConfirmation: z.string().min(8),
        role: z.enum(["user", "production_head"]),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords don't match",
        path: ["passwordConfirmation"],
    });

export default function RegisterPage() {
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const role = searchParams.get("role");

    if (!role) {
        throw new Error("Role not selected.");
    }

    const { execute, isPending, error } = useServerAction(signUpAction, {
        onError({ err }) {
            toast({
                title: "Something went wrong",
                description: err.message,
                variant: "destructive",
            });
        },
    });

    const form = useForm<z.infer<typeof registrationSchema>>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            passwordConfirmation: "",
            role: role as SignUpRoles,
        },
    });

    function onSubmit(values: z.infer<typeof registrationSchema>) {
        execute(values);
    }

    return (
        <div className="container py-24 flex min-h-[80dvh] items-center justify-center mx-auto">
            <Card className="w-1/2 min-w-fit">
                <CardHeader>
                    <CardTitle>Sign up with email and password</CardTitle>
                    <CardDescription>
                        Enter your information below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="w-full"
                                                    placeholder="Enter your first and last name"
                                                    type="text"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="w-full"
                                                    placeholder="Enter your email"
                                                    type="email"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="w-full"
                                                    placeholder="Enter your password"
                                                    type="password"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="passwordConfirmation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Confirm Password
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="w-full"
                                                    placeholder="Enter Confirm your Password"
                                                    type="password"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {error && (
                                    <Alert variant="destructive">
                                        <Terminal className="h-4 w-4" />
                                        <AlertTitle>
                                            Uh oh, we couldn&apos;t log you in
                                        </AlertTitle>
                                        <AlertDescription>
                                            {error.message}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <CardDescription>
                                    You are about to sign-up as a {role}. Please
                                    return to the previous page to change your
                                    role.
                                </CardDescription>

                                <div className="space-y-4">
                                    <Link
                                        href="/sign-up"
                                        className={cn(
                                            buttonVariants({
                                                variant: "secondary",
                                            }),
                                            "w-full"
                                        )}
                                    >
                                        Back
                                    </Link>

                                    <LoaderButton
                                        isLoading={isPending}
                                        className="w-full"
                                        type="submit"
                                    >
                                        Register
                                    </LoaderButton>
                                </div>
                            </form>
                        </Form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
