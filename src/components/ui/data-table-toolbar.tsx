"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "./input";
import { Button } from "./button";
import { X } from "lucide-react";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    inputFilterColumn: string;
    inputFilterText: string;
}

export function DataTableToolbar<TData>({
    table,
    inputFilterColumn,
    inputFilterText,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-3">
                <Input
                    placeholder={inputFilterText}
                    value={
                        (table
                            .getColumn(inputFilterColumn)
                            ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn(inputFilterColumn)
                            ?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />
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
