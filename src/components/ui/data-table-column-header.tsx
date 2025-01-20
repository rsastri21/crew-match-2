import { cn } from "@/lib/utils";
import { Column } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
    title: string;
    shouldNotSort?: boolean;
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
    shouldNotSort,
}: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort() || shouldNotSort) {
        return <div className={cn(className)}>{title}</div>;
    }

    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8 data-[state=open]:bg-accent"
                    >
                        <span>{title}</span>
                        {column.getIsSorted() === "desc" ? (
                            <ArrowDown />
                        ) : column.getIsSorted() === "asc" ? (
                            <ArrowUp />
                        ) : (
                            <ChevronsUpDown />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem
                        onClick={() => column.toggleSorting(false)}
                    >
                        <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70 mr-1" />
                        Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => column.toggleSorting(true)}
                    >
                        <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70 mr-1" />
                        Desc
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => column.toggleVisibility(false)}
                    >
                        <EyeOff className="h-3.5 w-3.5 text-muted-foreground/70 mr-1" />
                        Hide
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
