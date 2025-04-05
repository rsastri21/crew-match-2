"use client";

import { buttonVariants } from "@/components/ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
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
    CircleUserRound,
    Clapperboard,
    Github,
    House,
    PlaneTakeoff,
    UserRoundPen,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DOCS_HOME_ITEM: SideBarItem = {
    url: "/docs",
    title: "Docs Home",
    icon: House,
};

const DOCS_GETTING_STARTED: SideBarItem = {
    url: "/docs/getting-started",
    title: "Getting Started",
    icon: PlaneTakeoff,
};

const DOCS_ROLES: SideBarItem[] = [
    {
        url: "/docs/users",
        title: "Users",
        icon: CircleUserRound,
    },
    {
        url: "/docs/productions",
        title: "Production Heads",
        icon: UserRoundPen,
    },
];

const DOCS_FOOTER_LINKS: SideBarItem[] = [
    {
        url: "https://www.luxfilmproductions.com/",
        title: "LUX Film Productions",
        icon: Clapperboard,
    },
    {
        url: "https://github.com/rsastri21/crew-match-2",
        title: "GitHub",
        icon: Github,
    },
];

export default function DocsSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar collapsible="offcanvas">
            <SidebarHeader>
                <Link
                    href={DOCS_HOME_ITEM.url}
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "w-full items-center justify-start"
                    )}
                >
                    <DOCS_HOME_ITEM.icon className="w-4 h-4" />
                    <span>{DOCS_HOME_ITEM.title}</span>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {generateSidebarLinks(
                                [DOCS_GETTING_STARTED],
                                pathname
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                {/* <SidebarGroup>
                    <SidebarGroupLabel>Roles</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {generateSidebarLinks(DOCS_ROLES, pathname)}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup> */}
            </SidebarContent>
            <SidebarFooter>
                <SidebarGroup>
                    <SidebarGroupLabel>Learn more</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {generateSidebarLinks(DOCS_FOOTER_LINKS, pathname)}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
