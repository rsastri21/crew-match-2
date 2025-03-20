import { buttonVariants } from "@/components/ui/button";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { SideBarItem } from "@/utils/types";
import { type ClassValue, clsx } from "clsx";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateSidebarLinks(items: SideBarItem[], pathname: string) {
    return items.map((item) => (
        <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={item.url === pathname}>
                <Link
                    href={item.url}
                    className={cn(
                        buttonVariants({
                            variant: "ghost",
                        }),
                        "w-full items-center justify-start"
                    )}
                >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    ));
}

export function formatBytes(
    bytes: number,
    opts: {
        decimals?: number;
        sizeType?: "accurate" | "normal";
    } = {}
) {
    const { decimals = 0, sizeType = "normal" } = opts;

    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
    if (bytes === 0) return "0 Byte";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
        sizeType === "accurate"
            ? accurateSizes[i] ?? "Bytes"
            : sizes[i] ?? "Bytes"
    }`;
}
