import { googleAuth } from "@/lib/auth";
import { cookies } from "next/headers";
import { generateCodeVerifier, generateState } from "arctic";
import { NextRequest } from "next/server";
import { Buffer } from "buffer";

export async function GET(request: NextRequest): Promise<Response> {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const url = await googleAuth.createAuthorizationURL(state, codeVerifier, {
        scopes: ["profile", "email"],
    });

    const role = request.nextUrl.searchParams.get("role");

    if (role) {
        const encodedRole = Buffer.from(role, "binary").toString("base64");
        cookies().set("user_role", encodedRole, {
            secure: true,
            path: "/",
            httpOnly: true,
            maxAge: 60 * 10,
        });
    }

    cookies().set("google_oauth_state", state, {
        secure: true,
        path: "/",
        httpOnly: true,
        maxAge: 60 * 10,
    });

    cookies().set("google_code_verifier", codeVerifier, {
        secure: true,
        path: "/",
        httpOnly: true,
        maxAge: 60 * 10,
    });

    return Response.redirect(url);
}
