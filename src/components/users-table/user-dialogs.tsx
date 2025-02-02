import { UserRow } from "@/data/users";
import { useToast } from "../ui/use-toast";
import { useServerAction } from "zsa-react";
import { updateUserAction } from "./actions";
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

export function handleDialogMenu(mode: string, row: UserRow) {
    switch (mode) {
        case "make_admin":
            return <UpdateUserPermissionsDialog row={row} mode="promote" />;
        case "remove_admin":
            return <UpdateUserPermissionsDialog row={row} mode="demote" />;
        default:
            return null;
    }
}

function UpdateUserPermissionsDialog({
    row,
    mode,
}: {
    row: UserRow;
    mode: "promote" | "demote";
}) {
    const { toast } = useToast();
    const { execute } = useServerAction(updateUserAction, {
        onError({ err }) {
            toast({
                title: "Failed to update permissions",
                description: err.message,
                variant: "destructive",
            });
        },
        onSuccess() {
            toast({
                title: "Successfully updated user's permissions",
            });
        },
    });

    function handleConfirmClick() {
        execute({
            id: row.id,
            isAdmin: mode === "promote",
        });
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {mode === "promote"
                        ? `Grant ${row.name} admin permissions?`
                        : `Remove admin permissions from ${row.name}?`}
                </DialogTitle>
                <DialogDescription>
                    This will take effect immediately and can be reversed at any
                    time.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <div className="flex flex-wrap justify-center gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button
                            variant={
                                mode === "promote" ? "default" : "destructive"
                            }
                            onClick={handleConfirmClick}
                        >
                            Confirm
                        </Button>
                    </DialogClose>
                </div>
            </DialogFooter>
        </DialogContent>
    );
}
