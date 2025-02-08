"use client";

import { ProductionRow } from "@/data/productions";
import { User } from "@/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../ui/data-table-column-header";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { ActionCell } from "./actions-cell-component";

export function productionTableColumnFactory(
    user: User
): ColumnDef<ProductionRow>[] {
    return [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-start">
                    <Link
                        href={`/production/${row.original.id}/view`}
                        className={cn(
                            buttonVariants({ variant: "link" }),
                            "p-0"
                        )}
                    >
                        {row.original.name}
                    </Link>
                </div>
            ),
        },
        {
            accessorKey: "roles",
            header: ({ column }) => (
                <DataTableColumnHeader
                    className="flex items-center justify-center"
                    column={column}
                    title="Roles Filled"
                    shouldNotSort
                />
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Badge>{row.original.roles}</Badge>
                </div>
            ),
        },
        {
            accessorKey: "lead",
            header: ({ column }) => (
                <DataTableColumnHeader
                    className="flex items-center justify-center"
                    column={column}
                    title="Lead"
                />
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Badge>{row.original.lead}</Badge>
                </div>
            ),
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <DataTableColumnHeader
                    className="flex items-center justify-center"
                    column={column}
                    title="Created"
                />
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    {row.original.createdAt.toLocaleDateString()}
                </div>
            ),
        },
        {
            accessorKey: "updatedAt",
            header: ({ column }) => (
                <DataTableColumnHeader
                    className="flex items-center justify-center"
                    column={column}
                    title="Updated"
                />
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    {row.original.updatedAt.toLocaleDateString()}
                </div>
            ),
        },
        {
            accessorKey: "actions",
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Actions"
                    className="flex items-center justify-center"
                    shouldNotSort
                />
            ),
            cell: ({ row }) => <ActionCell row={row} />,
        },
    ];
}

export const productionFilters = [
    {
        inputFilterColumn: "name" as keyof ProductionRow,
        inputFilterText: "Filter productions...",
    },
];
