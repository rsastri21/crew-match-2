import { invalidateSession, validateRequest } from "@/lib/auth";
import { deleteSessionTokenCookie } from "@/lib/session";
import { redirect } from "next/navigation";

export async function GET(): Promise<Response> {
    const { session } = await validateRequest();
    if (!session) {
        redirect("/sign-in");
    }

    await invalidateSession(session.id);
    deleteSessionTokenCookie();
    redirect("/signed-out");
}
