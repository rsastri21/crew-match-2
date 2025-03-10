import { setSession } from "@/lib/session";
import { verifyEmail } from "@/utils/users";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
    try {
        const url = new URL(request.url);
        const token = url.searchParams.get("token");

        if (!token) {
            return new Response(null, {
                status: 302,
                headers: {
                    Location: "/sign-in",
                },
            });
        }

        const { id } = await verifyEmail(token);
        await setSession(id);

        return new Response(null, {
            status: 302,
            headers: {
                Location: "/verify-success",
            },
        });
    } catch (err) {
        console.error(err);
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/sign-in",
            },
        });
    }
}
