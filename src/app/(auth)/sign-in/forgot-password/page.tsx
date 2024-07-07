"use client";

import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { resetPasswordAction } from "./actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoaderButton } from "@/components/loader-button";

const resetPasswordSchema = z.object({
    email: z.string().email(),
});

export default function ForgotPasswordPage() {
    const { toast } = useToast();

    const { execute, isPending, isSuccess } = useServerAction(
        resetPasswordAction,
        {
            onError({ err }) {
                toast({
                    title: "Something went wrong",
                    description: err.message,
                    variant: "destructive",
                });
            },
            onSuccess() {
                toast({
                    title: "Reset link sent!",
                    description:
                        "Check your inbox for a link to reset your password.",
                    variant: "success",
                });
            },
        }
    );

    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
        execute(values);
    }

    return (
        <div className="container py-24 flex min-h-[80dvh] items-center justify-center mx-auto">
            <Card className="w-1/2 min-w-fit">
                <CardHeader>
                    <CardTitle>Forgot Password</CardTitle>
                    <CardDescription>
                        Reset your password for Crew Match.
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
                                <LoaderButton
                                    isLoading={isPending}
                                    className="w-full"
                                    type="submit"
                                >
                                    Send Reset Email
                                </LoaderButton>
                            </form>
                        </Form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
