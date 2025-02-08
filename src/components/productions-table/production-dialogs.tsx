import { ProductionRow } from "@/data/productions";
import { useToast } from "../ui/use-toast";
import { useServerAction } from "zsa-react";
import { deleteProductionAction } from "./actions";
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

export function handleDialogMenu(mode: string, row: ProductionRow) {
    switch (mode) {
        case "delete":
            return <DeleteDialog row={row} />;
        default:
            return null;
    }
}

function DeleteDialog({ row }: { row: ProductionRow }) {
    const { toast } = useToast();
    const { execute } = useServerAction(deleteProductionAction, {
        onError({ err }) {
            toast({
                title: "Failed to delete production",
                description: err.message,
                variant: "destructive",
            });
        },
        onSuccess() {
            toast({
                title: "Successfully deleted production",
            });
        },
    });

    function handleDeleteClick() {
        execute({
            id: row.id,
        });
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Delete {row.name}?</DialogTitle>
                <DialogDescription>
                    Remove {row.name} from the system. This action cannot be
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
                            onClick={handleDeleteClick}
                        >
                            Delete
                        </Button>
                    </DialogClose>
                </div>
            </DialogFooter>
        </DialogContent>
    );
}
