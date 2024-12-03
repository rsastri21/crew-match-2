"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import type { CandidateRow } from "@/data/candidates";
import { ColumnDef } from "@tanstack/react-table";

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
                    ? "bg-green-600 dark:bg-indigo-400"
                    : ""
            }`;
            return (
                <div className="flex items-center justify-center">
                    <Badge className={badgeStyle}>{status}</Badge>
                </div>
            );
        },
    },
];
