"use client";

import { z } from "zod";
import { useServerAction } from "zsa-react";
import { changePasswordAction } from "./actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { LoaderButton } from "@/components/loader-button";
import { Input } from "@/components/ui/input";

const changePasswordSchema = z
    .object({
        token: z.string(),
        password: z.string().min(8),
        passwordConfirmation: z.string().min(8),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords do not match.",
        path: ["passwordConfirmation"],
    });

export default function ResetPasswordPage({
    searchParams,
}: {
    searchParams: { token: string };
}) {
    const { execute, isPending, isSuccess, error } =
        useServerAction(changePasswordAction);

    const form = useForm<z.infer<typeof changePasswordSchema>>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            password: "",
            token: searchParams.token,
            passwordConfirmation: "",
        },
    });

    function onSubmit(values: z.infer<typeof changePasswordSchema>) {
        execute({
            token: values.token,
            password: values.password,
        });
    }

    return (
        <div className="container py-24 flex min-h-[80dvh] items-center justify-center mx-auto">
            <Card className="w-1/2 min-w-fit">
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                        Choose a new password below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isSuccess && (
                        <div className="space-y-4">
                            <Alert variant="success">
                                <Terminal className="w-4 h-4" />
                                <AlertTitle>Password updated</AlertTitle>
                                <AlertDescription>
                                    Your password has been changed successfully.
                                </AlertDescription>
                            </Alert>
                            <Button
                                variant="default"
                                asChild
                                className="w-full"
                            >
                                <Link href="/sign-in/email">
                                    Login with New Password
                                </Link>
                            </Button>
                        </div>
                    )}
                    {!isSuccess && (
                        <div className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <Terminal className="w-4 h-4" />
                                    <AlertTitle>
                                        Something went wrong
                                    </AlertTitle>
                                    <AlertDescription>
                                        {error.message}
                                    </AlertDescription>
                                </Alert>
                            )}
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-6"
                                >
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
                                                        placeholder="Enter your new password"
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
                                                        placeholder="Confirm your password"
                                                        type="password"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <LoaderButton
                                        isLoading={isPending}
                                        className="w-full"
                                        type="submit"
                                    >
                                        Change Password
                                    </LoaderButton>
                                </form>
                            </Form>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
