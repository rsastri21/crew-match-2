"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Profile, User } from "@/db/schema";
import { getDashboardUrl } from "@/utils/redirects";
import { Film, House, LogOut, SquarePen, UserPen } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import ProfileHeader from "./ProfileHeader";
import useWindowSize from "@/hooks/useWindowSize";
import ProfileEditForm from "./ProfileEditForm";

export default function ProfileDropdownClient({
    user,
    profile,
}: {
    user: User;
    profile: Profile;
}) {
    const { width } = useWindowSize();
    const sheetSide =
        typeof width === "undefined" || width >= 768 ? "right" : "bottom";

    return (
        <Sheet>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger>
                    <Suspense
                        fallback={
                            <div className="bg-gray-800 rounded-full h-10 w-10 shrink-0 flex items-center justify-center">
                                ..
                            </div>
                        }
                    >
                        <ProfileAvatar profile={profile} />
                    </Suspense>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="space-y-2">
                    <DropdownMenuLabel>{profile.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <SheetTrigger>
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <span className="flex items-center">
                                <UserPen className="w-4 h-4 mr-2" />
                                Edit Profile
                            </span>
                        </DropdownMenuItem>
                    </SheetTrigger>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link
                            className="flex items-center"
                            href={getDashboardUrl("user")}
                        >
                            <House className="w-4 h-4 mr-2" />
                            Dashboard
                        </Link>
                    </DropdownMenuItem>
                    {user.role === "production_head" ? (
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link
                                className="flex items-center"
                                href={getDashboardUrl("production_head")}
                            >
                                <Film className="w-4 h-4 mr-2" />
                                Productions
                            </Link>
                        </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link
                            className="flex items-center"
                            href="/candidate/discover"
                        >
                            <SquarePen className="w-4 h-4 mr-2" />
                            Registration
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link
                            className="flex items-center"
                            href={"/api/sign-out"}
                            prefetch={false}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <SheetContent side={sheetSide} className="space-y-4">
                <SheetHeader>
                    <ProfileHeader
                        name={profile.name}
                        email={user.email}
                        image={profile.image}
                    />
                    <SheetTitle className="text-left">Edit profile</SheetTitle>
                    <SheetDescription className="text-left">
                        Modify your profile here. Click save when you&apos;re
                        done.
                    </SheetDescription>
                </SheetHeader>
                <ProfileEditForm user={user} profile={profile} />
            </SheetContent>
        </Sheet>
    );
}

function ProfileAvatar({ profile }: { profile: Profile }) {
    return (
        <Avatar className="w-10 h-10">
            <AvatarImage src={profile.image!} />
            <AvatarFallback>
                {profile.name?.substring(0, 2).toUpperCase() ?? "AA"}
            </AvatarFallback>
        </Avatar>
    );
}
