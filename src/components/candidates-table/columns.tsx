"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import type { CandidateRow } from "@/data/candidates";
import { ColumnDef } from "@tanstack/react-table";
import { ActionCell } from "./actions-cell-component";
import type { User } from "@/db/schema";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "../ui/hover-card";
import { Separator } from "../ui/separator";
import HoverCardList from "./hover-card-list";

export function candidateTableColumnFactory(
    user: User
): ColumnDef<CandidateRow>[] {
    const getActionsColumn = (): ColumnDef<CandidateRow>[] => {
        if (user.isAdmin || user.role === "production_head") {
            return [
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
                    cell: ({ row }) => <ActionCell row={row} user={user} />,
                },
            ];
        }
        return [];
    };

    return [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
            cell: ({ row }) => (
                <HoverCard openDelay={200}>
                    <HoverCardTrigger>{row.original.name}</HoverCardTrigger>
                    <HoverCardContent className="w-64 flex flex-col gap-2">
                        <div className="w-full flex justify-between items-center">
                            <h1 className="text-lg font-medium">
                                {row.original.name}
                            </h1>
                            <Badge className="text-xs font-medium">
                                {row.original.status}
                            </Badge>
                        </div>
                        <Separator />
                        <HoverCardList
                            title="Productions"
                            values={row.original.interestedProductions}
                            disambiguator={row.original.name}
                        />
                        {row.original.status !== "acting" && (
                            <HoverCardList
                                title="Roles"
                                values={row.original.interestedRoles}
                                disambiguator={row.original.name}
                            />
                        )}
                        {row.original.roles.length ? (
                            <>
                                <Separator />
                                <div className="w-full flex flex-col gap-1">
                                    <h3 className="text-sm font-medium w-full">
                                        Assigned Roles
                                    </h3>
                                    <ol className="list-disc list-inside">
                                        {row.original.roles.map(
                                            (role, index) => (
                                                <li
                                                    key={`${row.original.name}_${role}_${index}`}
                                                >
                                                    {role.role},{" "}
                                                    {role.production}
                                                </li>
                                            )
                                        )}
                                    </ol>
                                </div>
                            </>
                        ) : null}
                    </HoverCardContent>
                </HoverCard>
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
                <DataTableColumnHeader
                    column={column}
                    title="Quarters in LUX"
                />
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
                            <Badge className="line-clamp-1">
                                {interestedRoles[0]}
                            </Badge>
                        ) : null}
                    </div>
                );
            },
            filterFn: "arrIncludes",
        },
        {
            accessorKey: "interestedProductions",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Top Production" />
            ),
            cell: ({ row }) => {
                const interestedProductions =
                    row.original.interestedProductions;
                return (
                    <div className="flex flex-col items-start justify-start gap-2">
                        <Badge className="line-clamp-1">
                            {interestedProductions[0]}
                        </Badge>
                    </div>
                );
            },
            filterFn: "arrIncludes",
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
        ...getActionsColumn(),
    ];
}

export const candidateFilters = [
    {
        inputFilterColumn: "name" as keyof CandidateRow,
        inputFilterText: "Filter candidates...",
    },
    {
        inputFilterColumn: "interestedRoles" as keyof CandidateRow,
        inputFilterText: "Filter roles...",
    },
    {
        inputFilterColumn: "interestedProductions" as keyof CandidateRow,
        inputFilterText: "Filter productions...",
    },
];
