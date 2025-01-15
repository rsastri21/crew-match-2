import {
    TooltipProvider,
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { ReactNode } from "react";

interface FormHelpTipProps {
    children: ReactNode;
}

export default function FormHelpTip({ children }: FormHelpTipProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger type="button">
                    <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>{children}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
