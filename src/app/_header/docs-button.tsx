import { buttonVariants } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { BookText } from "lucide-react";
import Link from "next/link";

export function DocsButton() {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <Link
                        href="/docs"
                        className={cn(
                            buttonVariants({ variant: "ghost", size: "icon" })
                        )}
                    >
                        <BookText className="h-[1.6rem] w-[1.6rem]" />
                        <span className="sr-only">Docs</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Docs</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
