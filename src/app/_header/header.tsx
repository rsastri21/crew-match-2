import Link from "next/link";
import { ModeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { getUserProfile } from "@/utils/users";
import { Suspense, cache } from "react";
import { getCurrentUser } from "@/lib/session";
import { Loader2Icon } from "lucide-react";
import { User } from "@/db/schema";
import ProfileDropdownClient from "./ProfileDropdown.client";
import { AdminButton } from "./admin-button";

const profileLoader = cache(getUserProfile);

export async function Header() {
    return (
        <nav className="border-b py-4 h-[72px]">
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

async function ProfileDropdown({ user }: { user: User }) {
    const profile = await profileLoader(user.id);
    return <ProfileDropdownClient user={user} profile={profile} />;
}

async function HeaderActions() {
    const user = await getCurrentUser();
    const isSignedIn = !!user;

    return (
        <>
            {isSignedIn ? (
                <div className="flex items-center justify-start gap-4">
                    <div className="flex items-center justify-between gap-1">
                        <AdminButton />
                        <ModeToggle />
                    </div>
                    <ProfileDropdown user={user} />
                </div>
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
