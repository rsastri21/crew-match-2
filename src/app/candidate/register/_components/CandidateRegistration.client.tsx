"use client";

import { useToast } from "@/components/ui/use-toast";
import { UserWithCandidateProfile } from "@/db/schema";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { createCandidateAction } from "../actions";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import FormCard from "../../../../components/FormCard";
import { Input } from "@/components/ui/input";

import FormHelpTip from "../../../../components/FormHelpTip";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { useDragControls } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RankItem, RankSection } from "./ReorderComponents";
import { LoaderButton } from "@/components/loader-button";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePersistForm } from "@/hooks/use-persist-form";
import { useRouter } from "next/navigation";

const candidateSchema = z.object({
    name: z.string(),
    userId: z.string(),
    registrationCode: z.string().min(6).max(6),
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
    roles,
    isRegistrationOpen,
}: {
    userInfo: UserWithCandidateProfile;
    productions: string[];
    roles: string[];
    isRegistrationOpen: boolean;
}) {
    const { toast } = useToast();
    const router = useRouter();

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

    const {
        form,
        lastPersistedTimestamp,
        extraState,
        setExtraState,
        clearLocalState,
    } = usePersistForm({
        schema: candidateSchema,
        storageKey: "cm_candidate_registration_form_data",
        defaultValues: {
            name: userInfo.profile!.name!,
            userId: userInfo.id,
            yearsInUW: userInfo.candidate?.yearsInUW?.toString() || "0",
            quartersInLUX: userInfo.candidate?.quartersInLUX?.toString() || "0",
            registrationCode: "",
            isActing: userInfo.candidate?.isActing || false,
            prioritizeProductions:
                userInfo.candidate?.prioritizeProductions || true,
        },
        defaultExtraState: {
            interestedProductions:
                userInfo.candidate?.interestedProductions ?? productions,
            interestedRoles: userInfo.candidate?.interestedRoles ?? [],
        },
    });

    const [selectedRoles, setSelectedRoles] = useState<boolean[]>([]);

    useEffect(() => {
        setSelectedRoles(
            roles.map((role) => extraState.interestedRoles.includes(role))
        );
    }, [extraState.interestedRoles]);

    const watchIsActing = form.watch("isActing");

    function handleRoleCheckboxChange(index: number, checked: boolean) {
        const newSelectedRoles: boolean[] = [...selectedRoles];
        newSelectedRoles[index] = checked;
        setExtraState((prev) => ({
            interestedProductions: prev.interestedProductions,
            interestedRoles: roles.filter((_, i) => newSelectedRoles[i]),
        }));
        setSelectedRoles(newSelectedRoles);
    }

    function handleProductionsReorder(newOrder: string[]) {
        setExtraState((prev) => ({
            interestedRoles: prev.interestedRoles,
            interestedProductions: newOrder,
        }));
    }

    function handleRolesReorder(newOrder: string[]) {
        setExtraState((prev) => ({
            interestedRoles: newOrder,
            interestedProductions: prev.interestedProductions,
        }));
    }

    function onSubmit(values: z.infer<typeof candidateSchema>) {
        if (!watchIsActing && extraState.interestedRoles.length !== 3) {
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
            interestedProductions: extraState.interestedProductions,
            interestedRoles: watchIsActing ? [] : extraState.interestedRoles,
        });
        clearLocalState();
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
                        <FormField
                            control={form.control}
                            name="registrationCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <span className="flex w-full items-center justify-between">
                                            Registration Code
                                            <FormHelpTip>
                                                <p>
                                                    Enter the registration code
                                                    for this quarter. This can
                                                    be retrieved from a LUX
                                                    officer.
                                                </p>
                                            </FormHelpTip>
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="w-full"
                                            placeholder="Enter registration code"
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
                                                Prioritize productions
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
                            values={extraState.interestedProductions}
                            onReorder={handleProductionsReorder}
                        >
                            {extraState.interestedProductions.map(
                                (item, index) => (
                                    <RankItem
                                        key={item}
                                        value={item}
                                        rankNumber={index}
                                        dragListener={true}
                                        dragControls={controls}
                                    />
                                )
                            )}
                        </RankSection>
                    </FormCard>
                    {!watchIsActing && (
                        <FormCard
                            title="Roles"
                            description="Select 3 roles you would be interested in performing. Then, rank the roles in order of preference."
                        >
                            <ul className="flex flex-col gap-4 rounded-lg border p-4 bg-background">
                                {roles.map((ROLE, index) => (
                                    <div
                                        key={ROLE}
                                        className="flex flex-row items-center justify-between"
                                    >
                                        <Label
                                            htmlFor={ROLE}
                                            className={`${
                                                !selectedRoles[index] &&
                                                extraState.interestedRoles
                                                    .length >= 3
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
                                                extraState.interestedRoles
                                                    .length >= 3
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
                            {extraState.interestedRoles.length === 3 && (
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
                                        values={extraState.interestedRoles}
                                        onReorder={handleRolesReorder}
                                    >
                                        {extraState.interestedRoles.map(
                                            (item, index) => (
                                                <RankItem
                                                    key={item}
                                                    value={item}
                                                    rankNumber={index}
                                                    dragListener={true}
                                                    dragControls={controls}
                                                />
                                            )
                                        )}
                                    </RankSection>
                                </>
                            )}
                        </FormCard>
                    )}
                    <Card className="w-full md:w-3/4 mx-auto px-6 py-4 flex flex-wrap justify-center md:justify-end items-center gap-2">
                        {lastPersistedTimestamp && (
                            <p className="font-medium text-muted-foreground">
                                Last saved:{" "}
                                {new Date(
                                    lastPersistedTimestamp
                                ).toLocaleString()}
                            </p>
                        )}
                        <Button
                            variant="secondary"
                            type="button"
                            className="w-fit"
                            onClick={() => {
                                clearLocalState();
                                router.push("/user/dashboard");
                            }}
                        >
                            Discard Changes
                        </Button>
                        <LoaderButton
                            isLoading={isPending}
                            className="w-fit"
                            type="submit"
                            disabled={!isRegistrationOpen}
                        >
                            Submit
                        </LoaderButton>
                    </Card>
                </form>
            </Form>
        </div>
    );
}
