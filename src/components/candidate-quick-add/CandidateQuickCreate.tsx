"use client";

import { RoleWithCandidateName } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import FormCard from "../FormCard";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { LoaderButton } from "../loader-button";
import { useServerAction } from "zsa-react";
import { quickCreateAction } from "./actions";
import { useToast } from "../ui/use-toast";

const quickCreateSchema = z.object({
    name: z.string().min(1, { message: "A candidate name is required." }),
    roleId: z.string(),
});

export default function CandidateQuickCreate({
    roles,
}: {
    roles: RoleWithCandidateName[];
}) {
    const { toast } = useToast();

    const { execute, isPending } = useServerAction(quickCreateAction, {
        onError({ err }) {
            toast({
                title: "Failed to create candidate",
                description: err.message,
                variant: "destructive",
            });
        },
        onSuccess({ data }) {
            toast({
                title: "Successfully created candidate!",
                description: `${data.name} has been assigned to this production`,
            });
        },
    });

    const form = useForm<z.infer<typeof quickCreateSchema>>({
        resolver: zodResolver(quickCreateSchema),
        defaultValues: {
            name: "",
            roleId: "",
        },
    });

    function onSubmit(values: z.infer<typeof quickCreateSchema>) {
        execute({ ...values, roleId: Number(values.roleId) });
        form.reset();
    }

    return (
        <Form {...form}>
            <form
                className="w-full px-2"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormCard
                    title="Quick-Add Candidate"
                    description="Add a candidate that has not registered yet. They can update their information later."
                    className="md:w-full"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <span className="flex w-full items-center justify-between">
                                        Name
                                    </span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        className="w-full"
                                        placeholder="Enter a name for the candidate"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="roleId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <span className="flex w-full items-center justify-between">
                                        Role
                                    </span>
                                </FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value?.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a role to assign the candidate to" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {roles
                                            .filter((role) => !role.candidateId)
                                            .map((role, index) => (
                                                <SelectItem
                                                    key={`${role}-${index}`}
                                                    value={role.id.toString()}
                                                >
                                                    {role.role}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="w-full mt-2 flex justify-end items-center gap-2">
                        <LoaderButton
                            isLoading={isPending}
                            className="w-fit"
                            type="submit"
                        >
                            Create candidate
                        </LoaderButton>
                    </div>
                </FormCard>
            </form>
        </Form>
    );
}
