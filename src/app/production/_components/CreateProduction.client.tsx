"use client";

import { useToast } from "@/components/ui/use-toast";
import { ProductionWithRoles, User } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import {
    createProductionAction,
    editProductionAction,
} from "../create/actions";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import FormCard from "@/components/FormCard";
import FormHelpTip from "@/components/FormHelpTip";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoaderButton } from "@/components/loader-button";
import { getDashboardUrl } from "@/utils/redirects";
import { Badge } from "@/components/ui/badge";
import { CircleMinus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import AddRoleComponent from "./AddRole";
import { useModifyProduction } from "@/hooks/use-modify-production";
import RolesListComponent from "./RolesList";

const productionSchema = z.object({
    name: z.string().min(1, { message: "A production name is required." }),
    genre: z.string().min(1, { message: "A genre is required." }),
    logline: z.string().min(1, { message: "A logline is required." }),
    logistics: z.string().min(1, {
        message: "Please enter production logistics or other scheduling notes.",
    }),
    lookingFor: z.string().min(1, {
        message:
            "Please enter information about what crew members you're looking for.",
    }),
    pitchLink: z.string().url(),
    userId: z.string(),
    creationCode: z.string(),
});

export default function CreateProduction({
    user,
    production,
    isProductionCreationAvailable,
}: {
    user: User;
    production?: ProductionWithRoles;
    isProductionCreationAvailable?: boolean;
}) {
    const { toast } = useToast();
    const isEdit = production ? true : false;

    const {
        roles,
        handleAddRole,
        handleRemoveRole,
        handleDropCandidate,
        getSubmissionExpectations,
        reset,
    } = useModifyProduction(production);

    const { execute: executeCreate, isPending: isCreatePending } =
        useServerAction(createProductionAction, {
            onError({ err }) {
                toast({
                    title: "Failed to create production",
                    description: err.message,
                    variant: "destructive",
                });
            },
            onSuccess() {
                toast({
                    title: "Successfully created production!",
                    description: "Redirecting to the production's page",
                });
            },
        });

    const { execute: executeEdit, isPending: isEditPending } = useServerAction(
        editProductionAction,
        {
            onError({ err }) {
                toast({
                    title: "Failed to edit production",
                    description: err.message,
                    variant: "destructive",
                });
            },
            onSuccess() {
                toast({
                    title: "Successfully saved production!",
                    description: "Redirecting to the production's page",
                });
            },
        }
    );

    const form = useForm<z.infer<typeof productionSchema>>({
        resolver: zodResolver(productionSchema),
        defaultValues: {
            name: production?.name,
            genre: production?.genre,
            logline: production?.logline,
            logistics: production?.logistics,
            lookingFor: production?.lookingFor,
            pitchLink: production?.pitchLink,
            userId: production?.userId ?? user.id,
            creationCode: "",
        },
    });

    function onSubmit(values: z.infer<typeof productionSchema>) {
        if (isEdit) {
            const submissionExpectations = getSubmissionExpectations();
            executeEdit({
                ...values,
                rolesToCreate: submissionExpectations.create,
                rolesToDelete: submissionExpectations.delete,
                rolesToEdit: submissionExpectations.edit,
                productionId: production!.id,
            });
        } else {
            executeCreate(values);
        }
    }

    return (
        <div className="p-2 w-full min-w-fit flex flex-col gap-2">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormCard
                        title="Basic Information"
                        description="Let's begin with the basics."
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <span className="flex w-full items-center justify-between">
                                            Production name
                                            <FormHelpTip>
                                                <p>
                                                    To maintain consistency and
                                                    help others find your
                                                    production, this is not
                                                    modifiable after the
                                                    production is created.
                                                </p>
                                            </FormHelpTip>
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="w-full"
                                            placeholder="Enter a name for the production"
                                            disabled={isEdit}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="genre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <span className="flex w-full items-center justify-between">
                                            Genre
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="w-full"
                                            placeholder="Enter a genre for the production"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="pitchLink"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <span className="flex w-full items-center justify-between">
                                            Script link
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="w-full"
                                            placeholder="Enter the script URL"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Provide a link to the script for this
                                        production.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {!isEdit && (
                            <FormField
                                control={form.control}
                                name="creationCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <span className="flex w-full items-center justify-between">
                                                Production creation code
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="w-full"
                                                placeholder="Enter creation code"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Enter the production creation code
                                            for this quarter. This can be
                                            retrieved from a LUX officer.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </FormCard>
                    <FormCard
                        title="About the Production"
                        description="Let's move on to production details."
                    >
                        <FormField
                            control={form.control}
                            name="logline"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <span className="flex w-full items-center justify-between">
                                            Logline
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="w-full"
                                            placeholder="Provide a brief logline for the production"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="logistics"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <span className="flex w-full items-center justify-between">
                                            Logistics
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            className="w-full h-32"
                                            placeholder="Provide details on the logistics for the production"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lookingFor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <span className="flex w-full items-center justify-between">
                                            Looking for
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            className="w-full h-32"
                                            placeholder="Describe what crew members the production is looking for"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </FormCard>
                    {isEdit && (
                        <FormCard
                            title="Roles"
                            description="Edit the roles on your production. Removing a role populated with a member will remove them from your production and return them to the assignment pool while deleting the role. The drop option removes the candidate and keeps the role on your production."
                        >
                            <RolesListComponent
                                roles={roles}
                                removeRole={handleRemoveRole}
                                dropCandidate={handleDropCandidate}
                            />
                            <Separator />
                            <AddRoleComponent
                                handleRoleCreate={handleAddRole}
                            />
                            <Button
                                onClick={reset}
                                variant="secondary"
                                type="button"
                            >
                                Reset Changes
                            </Button>
                        </FormCard>
                    )}
                    <Card className="w-full md:w-3/4 mx-auto px-6 py-4 flex justify-center md:justify-end items-center gap-2">
                        <Link
                            href={
                                isEdit
                                    ? `/production/${production!.id}/view`
                                    : getDashboardUrl(user.role)
                            }
                            className={cn(
                                buttonVariants({
                                    variant: "secondary",
                                }),
                                "w-fit"
                            )}
                        >
                            Discard Changes
                        </Link>
                        <LoaderButton
                            isLoading={isEditPending || isCreatePending}
                            className="w-fit"
                            type="submit"
                            disabled={
                                typeof isProductionCreationAvailable !==
                                    "undefined" &&
                                !isProductionCreationAvailable
                            }
                        >
                            Submit
                        </LoaderButton>
                    </Card>
                </form>
            </Form>
        </div>
    );
}
