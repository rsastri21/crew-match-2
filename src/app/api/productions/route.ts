import { getAllProductionsWithAvailableRoles } from "@/data/productions";
import { validateSessionToken } from "@/lib/auth";
import { SESSION_COOKIE_NAME } from "@/lib/session";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME);

    /**
     * Validate session cookie to ensure user is authenticated.
     */

    if (!token) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { user } = await validateSessionToken(token.value);

    if (!user || !user.isAdmin || user.role === "user") {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    /**
     * Get data
     */
    const productions = await getAllProductionsWithAvailableRoles();
    return Response.json(productions, { status: 200 });
}
