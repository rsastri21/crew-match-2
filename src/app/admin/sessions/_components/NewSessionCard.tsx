"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useServerAction } from "zsa-react";
import { newSessionAction } from "../actions";
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

export default function NewSessionCard() {
    return (
        <Dialog>
            <Card className="w-full p-4 flex flex-col gap-2">
                <CardHeader className="p-0">
                    <CardTitle>Create New Session</CardTitle>
                    <CardDescription>
                        Reset Crew Match and start a new session. All candidates
                        and productions will be removed and new access codes
                        will be generated.
                    </CardDescription>
                </CardHeader>
                <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                        Create new session
                    </Button>
                </DialogTrigger>
            </Card>
            <NewSessionDialog />
        </Dialog>
    );
}

function NewSessionDialog() {
    const { toast } = useToast();
    const { execute } = useServerAction(newSessionAction, {
        onError({ err }) {
            toast({
                title: "Failed to create new session",
                description: err.message,
                variant: "destructive",
            });
        },
        onSuccess() {
            toast({
                title: "Successfully created new session!",
            });
        },
    });

    function handleConfirmClick() {
        execute();
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                    Creating a new session will remove all candidates and
                    productions from the system. This operation cannot be
                    undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <div className="flex flex-wrap justify-center gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmClick}
                        >
                            Yes, I am sure
                        </Button>
                    </DialogClose>
                </div>
            </DialogFooter>
        </DialogContent>
    );
}
