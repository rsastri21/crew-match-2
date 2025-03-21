import { buttonVariants } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { getCurrentUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { UserCog } from "lucide-react";
import Link from "next/link";

export async function AdminButton() {
    const user = await getCurrentUser();

    if (!user || !user.isAdmin) {
        return null;
    }

    return (
        <TooltipProvider>
            <Tooltip delayDuration={200}>
                <TooltipTrigger>
                    <Link
                        href="/admin"
                        className={cn(
                            buttonVariants({ variant: "ghost", size: "icon" })
                        )}
                    >
                        <UserCog className="h-[1.6rem] w-[1.6rem]" />
                        <span className="sr-only">Admin dashboard</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Admin Dashboard</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
