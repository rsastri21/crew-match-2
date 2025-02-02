"use client";

import { UserRow } from "@/data/users";
import type { User } from "@/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DataTableColumnHeader } from "../ui/data-table-column-header";
import { Badge } from "../ui/badge";

export function userTableColumnFactory(user: User): ColumnDef<UserRow>[] {
    return [
        {
            accessorKey: "image",
            header: "",
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Avatar>
                        <AvatarImage src={row.original.image ?? undefined} />
                        <AvatarFallback>
                            {row.original.name?.substring(0, 2).toUpperCase() ??
                                "AA"}
                        </AvatarFallback>
                    </Avatar>
                </div>
            ),
        },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
        },
        {
            accessorKey: "pronouns",
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Pronouns"
                    shouldNotSort
                />
            ),
        },
        {
            accessorKey: "email",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="E-mail" />
            ),
        },
        {
            accessorKey: "verified",
            header: ({ column }) => (
                <DataTableColumnHeader
                    className="items-center justify-center"
                    column={column}
                    title="Verified"
                />
            ),
            cell: ({ row }) => {
                const displayValue = row.original.verified
                    ? "Verified"
                    : "Not verified";
                return (
                    <div className="flex items-center justify-center">
                        <Badge
                            variant={
                                row.original.verified
                                    ? "default"
                                    : "destructive"
                            }
                        >
                            {displayValue}
                        </Badge>
                    </div>
                );
            },
        },
        {
            accessorKey: "role",
            header: ({ column }) => (
                <DataTableColumnHeader
                    className="items-center justify-center"
                    column={column}
                    title="Role"
                />
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Badge className="capitalize">
                        {row.original.role.replace(/_/g, " ")}
                    </Badge>
                </div>
            ),
        },
    ];
}

export const userFilters = [
    {
        inputFilterColumn: "name" as keyof UserRow,
        inputFilterText: "Filter users...",
    },
];
