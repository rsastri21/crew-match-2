import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CandidateRow } from "@/data/candidates";
import { Row } from "@tanstack/react-table";
import { Ellipsis, Trash2, UserRoundMinus, UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { handleDialogMenu } from "./candidate-dialogs";

export function ActionCell({ row }: { row: Row<CandidateRow> }) {
    const [dialogMenu, setDialogMenu] = useState<string>("none");
    const rowInfo = row.original;

    return (
        <Dialog>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <div className="flex items-center justify-center">
                        <Button size="icon" variant="ghost">
                            <Ellipsis />
                        </Button>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DialogTrigger asChild>
                        <DropdownMenuItem
                            onSelect={() => setDialogMenu("assign")}
                        >
                            <span className="pr-2">
                                <UserRoundPlus />
                            </span>{" "}
                            Assign to production
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuItem>
                        <span className="pr-2">
                            <UserRoundMinus />
                        </span>{" "}
                        Remove from production
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DialogTrigger asChild>
                        <DropdownMenuItem
                            onSelect={() => setDialogMenu("delete")}
                        >
                            <span className="pr-2">
                                <Trash2 className="text-destructive" />
                            </span>{" "}
                            Delete candidate
                        </DropdownMenuItem>
                    </DialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>
            {handleDialogMenu(dialogMenu, rowInfo)}
        </Dialog>
    );
}
