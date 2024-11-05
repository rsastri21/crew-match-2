import { ReactNode } from "react";
import { Separator } from "./ui/separator";

export default function PageContainer({
    heading,
    children,
}: {
    heading: ReactNode;
    children: ReactNode;
}) {
    return (
        <div className="container py-2 flex flex-col gap-2 h-full items-center mx-auto">
            {heading}
            <Separator />
            {children}
        </div>
    );
}
