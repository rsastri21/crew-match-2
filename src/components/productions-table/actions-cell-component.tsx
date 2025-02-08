"use client";

import { ProductionRow } from "@/data/productions";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Ellipsis, Trash2 } from "lucide-react";
import { handleDialogMenu } from "./production-dialogs";

export function ActionCell({ row }: { row: Row<ProductionRow> }) {
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
                            onSelect={() => setDialogMenu("delete")}
                        >
                            <span className="pr-2">
                                <Trash2 className="text-destructive" />
                            </span>{" "}
                            Delete production
                        </DropdownMenuItem>
                    </DialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>
            {handleDialogMenu(dialogMenu, rowInfo)}
        </Dialog>
    );
}
