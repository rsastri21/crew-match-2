"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import type { CandidateRow } from "@/data/candidates";
import { ColumnDef } from "@tanstack/react-table";
import { ActionCell } from "./actions-cell-component";

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
        cell: ({ row }) => <ActionCell row={row} />,
    },
];
