"use client";

import { buttonVariants } from "@/components/ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarRail,
} from "@/components/ui/sidebar";
import { cn, generateSidebarLinks } from "@/lib/utils";
import { SideBarItem } from "@/utils/types";
import {
    BookUser,
    CalendarCog,
    Clapperboard,
    House,
    Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_HOME_ITEM: SideBarItem = {
    url: "/admin",
    title: "Admin Home",
    icon: House,
};

const ADMIN_QUICK_LINKS: SideBarItem[] = [
    {
        url: "/admin/users",
        title: "Users",
        icon: Users,
    },
    {
        url: "/admin/candidates",
        title: "Candidates",
        icon: BookUser,
    },
    {
        url: "/admin/productions",
        title: "Productions",
        icon: Clapperboard,
    },
];

const MORE_TOOLS_ITEMS: SideBarItem[] = [
    {
        url: "/admin/sessions",
        title: "Sessions",
        icon: CalendarCog,
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar collapsible="offcanvas">
            <SidebarHeader>
                <Link
                    href={ADMIN_HOME_ITEM.url}
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "w-full items-center justify-start"
                    )}
                >
                    <ADMIN_HOME_ITEM.icon className="w-4 h-4" />
                    <span>{ADMIN_HOME_ITEM.title}</span>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Quick links</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {generateSidebarLinks(ADMIN_QUICK_LINKS, pathname)}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>More tools</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {generateSidebarLinks(MORE_TOOLS_ITEMS, pathname)}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
