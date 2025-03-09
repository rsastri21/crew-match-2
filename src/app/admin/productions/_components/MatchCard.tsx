"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useServerAction } from "zsa-react";
import { matchAction } from "../actions";

export default function MatchCard() {
    return (
        <Dialog>
            <Card className="w-full mx-auto">
                <CardHeader>
                    <div className="w-full flex flex-wrap justify-between items-center gap-2">
                        <section className="flex flex-col gap-1">
                            <CardTitle>Match Candidates</CardTitle>
                            <CardDescription>
                                Match candidates to productions. Choose to honor
                                candidate preferences or match absolutely.
                            </CardDescription>
                        </section>
                        <DialogTrigger asChild>
                            <Button
                                variant="default"
                                className="w-full lg:w-fit"
                            >
                                Match
                            </Button>
                        </DialogTrigger>
                    </div>
                </CardHeader>
            </Card>
            <MatchDialog />
        </Dialog>
    );
}

function MatchDialog() {
    const [honorPreferences, setHonorPreferences] = useState<boolean>(true);

    const { toast } = useToast();
    const { execute } = useServerAction(matchAction, {
        onError({ err }) {
            toast({
                title: "Failed to match",
                description: err.message,
                variant: "destructive",
            });
        },
        onSuccess({ data }) {
            toast({
                title: "Successfully matched!",
                description: `${data.candidatesAssigned} candidates were assigned. ${data.candidatesLeft} remain unmatched.`,
            });
        },
        onStart() {
            toast({
                title: "Starting candidate matching...",
            });
        },
    });

    function handleMatchClick() {
        execute({
            honorPreferences,
        });
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Match Candidates?</DialogTitle>
                <DialogDescription>
                    Candidates will be matched to productions with available
                    roles. Their preferences will be honored according to the
                    selection below.
                </DialogDescription>
            </DialogHeader>
            <div className="w-full flex items-center justify-between gap-2">
                <Label htmlFor="honor-preferences-toggle">
                    Honor preferences
                </Label>
                <Switch
                    id="honor-preferences-toggle"
                    checked={honorPreferences}
                    onCheckedChange={setHonorPreferences}
                />
            </div>
            <DialogFooter>
                <div className="flex flex-wrap justify-center gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button variant="default" onClick={handleMatchClick}>
                            Match
                        </Button>
                    </DialogClose>
                </div>
            </DialogFooter>
        </DialogContent>
    );
}
