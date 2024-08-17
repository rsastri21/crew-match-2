"use client";

import { useToast } from "@/components/ui/use-toast";
import { UserWithCandidateProfile } from "@/db/schema";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { createCandidateAction } from "../actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import FormCard from "./FormCard";
import { Input } from "@/components/ui/input";

import FormHelpTip from "./FormHelpTip";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useDragControls } from "framer-motion";
import { ROLES } from "@/data/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RankItem, RankSection } from "./ReorderComponents";
import { LoaderButton } from "@/components/loader-button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const candidateSchema = z.object({
    name: z.string(),
    userId: z.string(),
    yearsInUW: z
        .string()
        .min(1, { message: "A value for years in UW is required." }),
    quartersInLUX: z
        .string()
        .min(1, { message: "A value for quarters in LUX is required." }),
    isActing: z.boolean(),
    prioritizeProductions: z.boolean(),
});

export default function CandidateRegistration({
    userInfo,
    productions,
}: {
    userInfo: UserWithCandidateProfile;
    productions: string[];
}) {
    const { toast } = useToast();

    const [interestedProductions, setInterestedProductions] = useState<
        string[]
    >(userInfo.candidate?.interestedProductions ?? productions);
    const [interestedRoles, setInterestedRoles] = useState<string[]>(
        userInfo.candidate?.interestedRoles ?? []
    );
    const [selectedRoles, setSelectedRoles] = useState<boolean[]>(
        ROLES.map((role) => interestedRoles.includes(role))
    );

    const controls = useDragControls();

    const { execute, isPending, error } = useServerAction(
        createCandidateAction,
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
                    title: "Successfully registered!",
                    description: "Returning to your dashboard",
                });
            },
        }
    );

    const form = useForm<z.infer<typeof candidateSchema>>({
        resolver: zodResolver(candidateSchema),
        defaultValues: {
            name: userInfo.profile!.name!,
            userId: userInfo.id,
            yearsInUW: userInfo.candidate?.yearsInUW?.toString() || "0",
            quartersInLUX: userInfo.candidate?.quartersInLUX?.toString() || "0",
            isActing: userInfo.candidate?.isActing || false,
            prioritizeProductions:
                userInfo.candidate?.prioritizeProductions || true,
        },
    });

    const watchIsActing = form.watch("isActing");

    function handleRoleCheckboxChange(index: number, checked: boolean) {
        const newSelectedRoles: boolean[] = [...selectedRoles];
        newSelectedRoles[index] = checked;
        setInterestedRoles(ROLES.filter((role, i) => newSelectedRoles[i]));
        setSelectedRoles(newSelectedRoles);
    }

    function onSubmit(values: z.infer<typeof candidateSchema>) {
        if (!watchIsActing && interestedRoles.length !== 3) {
            toast({
                title: "Not enough roles selected",
                description: "Please rank 3 roles.",
                variant: "destructive",
            });
            return;
        }
        execute({
            ...values,
            yearsInUW: parseInt(values.yearsInUW),
            quartersInLUX: parseInt(values.quartersInLUX),
            interestedProductions,
            interestedRoles: watchIsActing ? [] : interestedRoles,
        });
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
                        <div className="flex w-full gap-2">
                            <h1 className="text-sm font-medium">Name:</h1>
                            <p className="text-sm">{userInfo.profile!.name}</p>
                        </div>
                        <FormField
                            control={form.control}
                            name="yearsInUW"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <span className="flex w-full items-center justify-between">
                                            Years at UW
                                            <FormHelpTip>
                                                <p>
                                                    A freshman would enter 1
                                                    here, and a sophomore would
                                                    enter 2. If you are not
                                                    entirely sure, take your
                                                    best guess.
                                                </p>
                                            </FormHelpTip>
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="w-full"
                                            placeholder="Enter years spent at UW"
                                            type="number"
                                            min={0}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="quartersInLUX"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <span className="flex w-full items-center justify-between">
                                            Quarters in LUX
                                            <FormHelpTip>
                                                <p>
                                                    Enter finished quarters. For
                                                    example, someone entering
                                                    their 3rd quarter in LUX
                                                    would enter 2.
                                                </p>
                                            </FormHelpTip>
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="w-full"
                                            placeholder="Enter quarters in LUX"
                                            type="number"
                                            min={0}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </FormCard>
                    <FormCard
                        title="Preferences"
                        description="You can register to be a cast member or a crew member.
                        For crew members, you can prioritize your production preferences or your role preferences. 
                        This is not available for cast members."
                    >
                        <FormField
                            control={form.control}
                            name="isActing"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Register as cast member
                                        </FormLabel>
                                        <FormDescription>
                                            Enable to register as cast, disable
                                            for crew.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {!watchIsActing && (
                            <FormField
                                control={form.control}
                                name="prioritizeProductions"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Priotize productions
                                            </FormLabel>
                                            <FormDescription>
                                                Prefer productions over roles
                                                when matching.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </FormCard>
                    <FormCard
                        title="Productions"
                        description="Rank productions in order of preference. You can learn more about each production on your dashboard."
                    >
                        <RankSection
                            axis="y"
                            values={interestedProductions}
                            onReorder={setInterestedProductions}
                        >
                            {interestedProductions.map((item, index) => (
                                <RankItem
                                    key={item}
                                    value={item}
                                    rankNumber={index}
                                    dragListener={true}
                                    dragControls={controls}
                                />
                            ))}
                        </RankSection>
                    </FormCard>
                    {!watchIsActing && (
                        <FormCard
                            title="Roles"
                            description="Select 3 roles you would be interested in performing. Then, rank the roles in order of preference."
                        >
                            <ul className="flex flex-col gap-4 rounded-lg border p-4 bg-background">
                                {ROLES.map((ROLE, index) => (
                                    <div
                                        key={ROLE}
                                        className="flex flex-row items-center justify-between"
                                    >
                                        <Label
                                            htmlFor={ROLE}
                                            className={`${
                                                !selectedRoles[index] &&
                                                interestedRoles.length >= 3
                                                    ? "text-muted-foreground"
                                                    : "text-foreground"
                                            }`}
                                        >
                                            {ROLE}
                                        </Label>
                                        <Checkbox
                                            id={ROLE}
                                            disabled={
                                                !selectedRoles[index] &&
                                                interestedRoles.length >= 3
                                            }
                                            checked={selectedRoles[index]}
                                            onCheckedChange={() =>
                                                handleRoleCheckboxChange(
                                                    index,
                                                    !selectedRoles[index]
                                                )
                                            }
                                        />
                                    </div>
                                ))}
                            </ul>
                            {interestedRoles.length === 3 && (
                                <>
                                    <div>
                                        <h1 className="font-medium text-lg">
                                            Rank Roles
                                        </h1>
                                        <p className="text-sm text-muted-foreground">
                                            Rank the roles selected above in
                                            order of preference.
                                        </p>
                                    </div>
                                    <RankSection
                                        axis="y"
                                        values={interestedRoles}
                                        onReorder={setInterestedRoles}
                                    >
                                        {interestedRoles.map((item, index) => (
                                            <RankItem
                                                key={item}
                                                value={item}
                                                rankNumber={index}
                                                dragListener={true}
                                                dragControls={controls}
                                            />
                                        ))}
                                    </RankSection>
                                </>
                            )}
                        </FormCard>
                    )}
                    <Card className="w-full md:w-3/4 mx-auto px-6 py-4 flex justify-center md:justify-end items-center gap-2">
                        <Link
                            href="/user/dashboard"
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
                            isLoading={isPending}
                            className="w-fit"
                            type="submit"
                        >
                            Submit
                        </LoaderButton>
                    </Card>
                </form>
            </Form>
        </div>
    );
}
