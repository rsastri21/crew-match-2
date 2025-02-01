"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "./input";
import { Button } from "./button";
import { X } from "lucide-react";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    inputFilters: {
        inputFilterColumn: Extract<keyof TData, string>;
        inputFilterText: string;
    }[];
}

export function DataTableToolbar<TData>({
    table,
    inputFilters,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-3">
                {inputFilters.map((filter) => (
                    <Input
                        key={filter.inputFilterColumn}
                        placeholder={filter.inputFilterText}
                        value={
                            (table
                                .getColumn(filter.inputFilterColumn)
                                ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table
                                .getColumn(filter.inputFilterColumn)
                                ?.setFilterValue(event.target.value)
                        }
                        className="h-8 w-[150px] lg:w-[250px]"
                    />
                ))}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-1 lg:px-2"
                    >
                        Reset
                        <X />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    );
}
