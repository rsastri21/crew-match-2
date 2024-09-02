import { Button, buttonVariants } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface ProductionInformationHeaderProps {
    name: string;
    director: string;
    pitchLink: string;
}

export default function ProductionInformationHeader(
    props: ProductionInformationHeaderProps
) {
    return (
        <CardHeader className="p-0 flex flex-row justify-between items-center">
            <div className="space-y-0.5">
                <h1 className="text-xl font-semibold">{props.name}</h1>
                <p className="text-muted-foreground text-sm font-medium">
                    Directed by: {props.director}
                </p>
            </div>
            <div className="flex gap-2 items-center justify-center">
                <Link
                    href={props.pitchLink}
                    className={cn(
                        buttonVariants({ variant: "secondary" }),
                        "w-fit"
                    )}
                >
                    View pitch
                </Link>
                <Button>I'm interested</Button>
            </div>
        </CardHeader>
    );
}
