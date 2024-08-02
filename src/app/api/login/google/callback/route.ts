import { getUserById } from "@/data/users";
import { googleAuth } from "@/lib/auth";
import { setSession } from "@/lib/session";
import { getAccountByGoogleIdUseCase } from "@/utils/accounts";
import { getDashboardUrl } from "@/utils/redirects";
import { createGoogleUser } from "@/utils/users";
import { OAuth2RequestError } from "arctic";
import { User } from "lucia";
import { cookies } from "next/headers";

export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const storedState = cookies().get("google_oauth_state")?.value ?? null;
    const codeVerifier = cookies().get("google_code_verifier")?.value ?? null;
    const encodedUserRole = cookies().get("user_role")?.value ?? null;

    if (
        !code ||
        !state ||
        !storedState ||
        state !== storedState ||
        !codeVerifier
    ) {
        return new Response(null, {
            status: 400,
        });
    }

    try {
        const tokens = await googleAuth.validateAuthorizationCode(
            code,
            codeVerifier
        );
        const response = await fetch(
            "https://openidconnect.googleapis.com/v1/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${tokens.accessToken}`,
                },
            }
        );
        const googleUser: GoogleUser = await response.json();

        const existingAccount = await getAccountByGoogleIdUseCase(
            googleUser.sub
        );

        if (existingAccount) {
            // By foreign key constraint, user must exist if account exists
            const existingUser = await getUserById(existingAccount.userId);
            await setSession(existingUser!.id, existingUser!.role);
            return new Response(null, {
                status: 302,
                headers: {
                    Location: getDashboardUrl(existingUser!.role),
                },
            });
        }

        // The user has not signed up at this point.
        // If this parameter is not provided, they cannot choose their role.
        if (!encodedUserRole) {
            return new Response(null, {
                status: 302,
                headers: {
                    Location: "/sign-up",
                },
            });
        }

        const role = Buffer.from(encodedUserRole, "base64").toString("binary");
        cookies().delete("user_role");

        // Role parameter will only be used if the user does not exist, so we can pass
        // "user" as default as role will be null for existing users.
        const user: User = await createGoogleUser(googleUser, role ?? "user");
        await setSession(user.id, user.role);
        return new Response(null, {
            status: 302,
            headers: {
                Location: getDashboardUrl(user.role),
            },
        });
    } catch (e) {
        if (e instanceof OAuth2RequestError) {
            return new Response(null, {
                status: 400,
            });
        }
        return new Response(null, {
            status: 500,
        });
    }
}

export interface GoogleUser {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    locale: string;
}
