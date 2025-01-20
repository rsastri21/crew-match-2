"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CandidateRow } from "@/data/candidates";
import { ColumnDef } from "@tanstack/react-table";
import { Ellipsis, Trash2, UserRoundMinus, UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { handleDialogMenu } from "./candidate-dialogs";

export const columns: ColumnDef<CandidateRow>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
    },
    {
        accessorKey: "yearsInUW",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Years at UW" />
        ),
    },
    {
        accessorKey: "quartersInLUX",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Quarters in LUX" />
        ),
    },
    {
        accessorKey: "interestedRoles",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Top Role" />
        ),
        cell: ({ row }) => {
            const interestedRoles = row.original.interestedRoles;
            return (
                <div className="flex items-center justify-start">
                    {interestedRoles[0]?.length ? (
                        <Badge>{interestedRoles[0]}</Badge>
                    ) : null}
                </div>
            );
        },
    },
    {
        accessorKey: "interestedProductions",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Top Production" />
        ),
        cell: ({ row }) => {
            const interestedProductions = row.original.interestedProductions;
            return (
                <div className="flex flex-col items-start justify-start gap-2">
                    <Badge>{interestedProductions[0]}</Badge>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Status"
                className="items-center justify-center"
            />
        ),
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            const badgeStyle = `${
                status === "acting"
                    ? "bg-indigo-600 dark:bg-indigo-400"
                    : status === "assigned"
                    ? "bg-green-600 dark:bg-green-400"
                    : ""
            }`;
            return (
                <div className="flex items-center justify-center">
                    <Badge className={badgeStyle}>{status}</Badge>
                </div>
            );
        },
    },
    {
        accessorKey: "actions",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Actions"
                className="items-center justify-center"
                shouldNotSort
            />
        ),
        cell: ({ row }) => {
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
                            <DropdownMenuItem>
                                <span className="pr-2">
                                    <UserRoundPlus />
                                </span>{" "}
                                Assign to production
                            </DropdownMenuItem>
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
        },
    },
];
