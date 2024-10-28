"use client";

import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { profileEditAction } from "./actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Profile, User } from "@/db/schema";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LoaderButton } from "@/components/loader-button";

const rolesEnum = z.enum(["user", "production_head"]);

const profileSchema = z.object({
    userId: z.string(),
    name: z.string().min(1, { message: "Name is required." }),
    pronouns: z.string(),
    role: rolesEnum,
});

export default function ProfileEditForm({
    user,
    profile,
}: {
    user: User;
    profile: Profile;
}) {
    const { toast } = useToast();

    const { execute, isPending } = useServerAction(profileEditAction, {
        onError({ err }) {
            toast({
                title: "Something went wrong",
                description: err.message,
                variant: "destructive",
            });
        },
        onSuccess() {
            toast({
                title: "Profile updated successfully!",
                description: "Enjoy your session",
            });
        },
    });

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            userId: user.id,
            name: profile.name ?? "",
            pronouns: profile.pronouns ?? "",
            role: user.role,
        },
    });

    function onSubmit(values: z.infer<typeof profileSchema>) {
        execute(values);
    }

    return (
        <div className="space-y-4">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
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
                        name="pronouns"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pronouns</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        className="w-full"
                                        placeholder="Enter your pronouns"
                                        type="text"
                                    />
                                </FormControl>
                                <FormDescription>
                                    Optionally enter your pronouns
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="user">
                                                Explore or join productions as a
                                                user
                                            </SelectItem>
                                            <SelectItem value="production_head">
                                                Create a production as a
                                                production head
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Role should only be modified if you are not
                                    leading a production.
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    <SheetClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </SheetClose>
                    <LoaderButton
                        isLoading={isPending}
                        className="w-fit"
                        type="submit"
                    >
                        Save changes
                    </LoaderButton>
                </form>
            </Form>
        </div>
    );
}
