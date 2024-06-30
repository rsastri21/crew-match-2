import Link from "next/link";
import { ModeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";

export function Header() {
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
                    <HeaderActions />
                </div>
            </div>
        </nav>
    );
}

function HeaderActions() {
    return (
        <>
            <ModeToggle />
            <Button asChild variant="default">
                <Link href="/sign-in">Sign In</Link>
            </Button>
        </>
    );
}
