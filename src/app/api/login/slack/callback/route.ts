import { getUserById } from "@/data/users";
import { User } from "@/db/schema";
import { slackAuth } from "@/lib/auth";
import { setSession } from "@/lib/session";
import { getAccountBySlackIdUseCase } from "@/utils/accounts";
import { getDashboardUrl } from "@/utils/redirects";
import { createSlackUser } from "@/utils/users";
import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";

export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const storedState = cookies().get("slack_oauth_state")?.value ?? null;
    const encodedUserRole = cookies().get("user_role")?.value ?? null;

    if (!code || !state || !storedState || state !== storedState) {
        return new Response(null, {
            status: 400,
        });
    }

    try {
        const tokens = await slackAuth.validateAuthorizationCode(code);
        const response = await fetch(
            "https://slack.com/api/openid.connect.userInfo",
            {
                headers: {
                    Authorization: `Bearer ${tokens.accessToken}`,
                },
            }
        );
        const slackUser: SlackUser = await response.json();

        const existingAccount = await getAccountBySlackIdUseCase(slackUser.sub);

        if (existingAccount) {
            const existingUser = await getUserById(existingAccount.userId);
            await setSession(existingUser!.id);
            return new Response(null, {
                status: 302,
                headers: {
                    Location: getDashboardUrl(existingUser!.role),
                },
            });
        }

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

        const user: User = await createSlackUser(slackUser, role ?? "user");
        await setSession(user.id);
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

export interface SlackUser {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    locale: string;
}
