import Link from "next/link";
import { ModeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { getUserProfile } from "@/utils/users";
import { Suspense, cache } from "react";
import { getCurrentUser } from "@/lib/session";
import { House, Loader2Icon, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDashboardUrl } from "@/utils/redirects";

const profileLoader = cache(getUserProfile);

export async function Header() {
    const user = await getCurrentUser();

    return (
        <nav className="border-b py-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex gap-8 items-center">
                    <Button variant="ghost">
                        <Link
                            href="/"
                            className="flex gap-2 items-center text-2xl font-semibold"
                        >
                            Crew Match
                        </Link>
                    </Button>
                </div>
                <div className="flex items-center justify-between gap-5">
                    <Suspense
                        fallback={
                            <div className="flex items-center justify-center w-40">
                                <Loader2Icon className="animate-spin w-4 h-4" />
                            </div>
                        }
                    >
                        <HeaderActions />
                    </Suspense>
                </div>
            </div>
        </nav>
    );
}

async function ProfileAvatar({ userId }: { userId: string }) {
    const profile = await profileLoader(userId);

    return (
        <Avatar className="w-10 h-10">
            <AvatarImage src={profile.image!} />
            <AvatarFallback>
                {profile.name?.substring(0, 2).toUpperCase() ?? "AA"}
            </AvatarFallback>
        </Avatar>
    );
}

async function ProfileDropdown({
    userId,
    role,
}: {
    userId: string;
    role: string;
}) {
    const profile = await profileLoader(userId);
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Suspense
                    fallback={
                        <div className="bg-gray-800 rounded-full h-10 w-10 shrink-0 flex items-center justify-center">
                            ..
                        </div>
                    }
                >
                    <ProfileAvatar userId={userId} />
                </Suspense>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="space-y-2">
                <DropdownMenuLabel>{profile.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                        className="flex items-center"
                        href={getDashboardUrl(role)}
                    >
                        <House className="w-4 h-4 mr-2" />
                        Dashboard
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link className="flex items-center" href={"/api/sign-out"}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

async function HeaderActions() {
    const user = await getCurrentUser();
    const isSignedIn = !!user;

    return (
        <>
            {isSignedIn ? (
                <>
                    <ModeToggle />
                    <ProfileDropdown userId={user.id} role={user.role} />
                </>
            ) : (
                <>
                    <ModeToggle />
                    <Button asChild variant="default">
                        <Link href="/sign-in">Sign In</Link>
                    </Button>
                </>
            )}
        </>
    );
}
