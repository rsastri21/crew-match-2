"use client";

import { UserRow } from "@/data/users";
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
import { Ellipsis, UserCheck, UserMinus } from "lucide-react";
import { handleDialogMenu } from "./user-dialogs";

export function ActionCell({ row }: { row: Row<UserRow> }) {
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
                    {rowInfo.isAdmin ? (
                        <DialogTrigger asChild>
                            <DropdownMenuItem
                                onSelect={() => setDialogMenu("remove_admin")}
                            >
                                <span className="pr-2">
                                    <UserMinus />
                                </span>
                                Remove admin access
                            </DropdownMenuItem>
                        </DialogTrigger>
                    ) : (
                        <DialogTrigger asChild>
                            <DropdownMenuItem
                                onSelect={() => setDialogMenu("make_admin")}
                            >
                                <span className="pr-2">
                                    <UserCheck />
                                </span>
                                Make admin
                            </DropdownMenuItem>
                        </DialogTrigger>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            {handleDialogMenu(dialogMenu, rowInfo)}
        </Dialog>
    );
}
