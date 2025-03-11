"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Loader2Icon } from "lucide-react";
import { useServerAction } from "zsa-react";
import {
    creationConfigUpdateAction,
    registrationConfigUpdateAction,
} from "../actions";

interface RegistrationSwitchProps {
    enabled: boolean;
}

export function CandidateRegistrationSwitch({
    enabled,
}: RegistrationSwitchProps) {
    const { toast } = useToast();
    const { execute, isPending } = useServerAction(
        registrationConfigUpdateAction,
        {
            onError({ err }) {
                toast({
                    title: "Failed to update registration status",
                    description: err.message,
                    variant: "destructive",
                });
            },
            onSuccess() {
                toast({
                    title: "Updated registration status",
                });
            },
        }
    );

    function handleSwitchChange(value: boolean) {
        execute({ enabled: value });
    }

    return (
        <div className="my-2 w-full flex flex-wrap items-center justify-between gap-2">
            <Label htmlFor="candidate-registration-switch">
                Accept new registrations
            </Label>
            <div className="flex w-fit gap-4 items-center">
                {isPending && (
                    <span className="flex items-center gap-1 font-medium text-xs text-muted-foreground">
                        <Loader2Icon className="animate-spin w-2 md:w-4 h-2 md:h-4" />{" "}
                        Syncing
                    </span>
                )}
                <Switch
                    checked={enabled}
                    onCheckedChange={handleSwitchChange}
                    id="candidate-registration-switch"
                />
            </div>
        </div>
    );
}

export function ProductionCreationSwitch({ enabled }: RegistrationSwitchProps) {
    const { toast } = useToast();
    const { execute, isPending } = useServerAction(creationConfigUpdateAction, {
        onError({ err }) {
            toast({
                title: "Failed to update creation status",
                description: err.message,
                variant: "destructive",
            });
        },
        onSuccess() {
            toast({
                title: "Updated creation status",
            });
        },
    });

    function handleSwitchChange(value: boolean) {
        execute({ enabled: value });
    }

    return (
        <div className="my-2 w-full flex flex-wrap items-center justify-between gap-2">
            <Label htmlFor="production-creation-switch">
                Allow production creations
            </Label>
            <div className="flex w-fit gap-4 items-center">
                {isPending && (
                    <span className="flex items-center gap-1 font-medium text-xs text-muted-foreground">
                        <Loader2Icon className="animate-spin w-2 md:w-4 h-2 md:h-4" />{" "}
                        Syncing
                    </span>
                )}
                <Switch
                    checked={enabled}
                    onCheckedChange={handleSwitchChange}
                    id="production-creation-switch"
                />
            </div>
        </div>
    );
}
