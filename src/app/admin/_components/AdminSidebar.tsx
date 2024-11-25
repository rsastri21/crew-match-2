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
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { BookUser, Clapperboard, House, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SideBarItem = {
    url: string;
    title: string;
    icon: any;
};

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
                            {ADMIN_QUICK_LINKS.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={item.url === pathname}
                                    >
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
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}