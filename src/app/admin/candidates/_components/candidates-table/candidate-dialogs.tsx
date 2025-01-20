import { Button } from "@/components/ui/button";
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { CandidateRow } from "@/data/candidates";
import { useServerAction } from "zsa-react";
import { deleteCandidateAction } from "../../actions";
import { useToast } from "@/components/ui/use-toast";

export function handleDialogMenu(mode: string, row: CandidateRow) {
    switch (mode) {
        case "delete":
            return <DeleteDialog row={row} />;
        default:
            return null;
    }
}

function DeleteDialog({ row }: { row: CandidateRow }) {
    const { toast } = useToast();
    const { execute } = useServerAction(deleteCandidateAction, {
        onError({ err }) {
            toast({
                title: "Failed to delete candidate",
                description: err.message,
                variant: "destructive",
            });
        },
        onSuccess() {
            toast({
                title: "Successfully deleted candidate",
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
