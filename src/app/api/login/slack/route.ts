import { slackAuth } from "@/lib/auth";
import { generateState } from "arctic";
import { NextRequest } from "next/server";
import { Buffer } from "buffer";
import { cookies } from "next/headers";

export async function GET(request: NextRequest): Promise<Response> {
    const state = generateState();
    const url = await slackAuth.createAuthorizationURL(state, {
        scopes: ["profile", "email"],
    });

    const role = request.nextUrl.searchParams.get("role");

    if (role) {
        const encodedRole = Buffer.from(role, "binary").toString("base64");
        cookies().set("user_role", encodedRole, {
            secure: process.env.NODE_ENV === "production",
            path: "/",
            httpOnly: true,
            maxAge: 60 * 10,
        });
    }

    cookies().set("slack_oauth_state", state, {
        secure: process.env.NODE_ENV === "production",
        path: "/",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax",
    });

    return Response.redirect(url);
}
