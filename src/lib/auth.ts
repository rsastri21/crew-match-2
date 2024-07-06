import "dotenv";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { Lucia, Session, User } from "lucia";
import { cookies } from "next/headers";
import { Google, Slack } from "arctic";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV === "production",
        },
    },
    getUserAttributes: (attributes) => {
        return {
            role: attributes.role,
        };
    },
});

export const validateRequest = async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
> => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
        return {
            user: null,
            session: null,
        };
    }

    const result = await lucia.validateSession(sessionId);

    try {
        if (result.session && result.session.fresh) {
            const sessionCookie = lucia.createSessionCookie(result.session.id);
            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            );
        }
        if (!result.session) {
            const sessionCookie = lucia.createBlankSessionCookie();
            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            );
        }
    } catch {
        // NextJS throws an error when` attempting to set cookies during rendering
    }
    return result;
};

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseUserAttributes {
    role: "user" | "production_head" | "admin";
}

export const googleAuth = new Google(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    `${process.env.HOST_NAME!}/api/login/google/callback`
);

export const slackAuth = new Slack(
    process.env.SLACK_CLIENT_ID!,
    process.env.SLACK_CLIENT_SECRET!,
    `${
        process.env.NODE_ENV === "production"
            ? process.env.HOST_NAME!
            : "https://platypus-meet-evenly.ngrok-free.app"
    }/api/login/slack/callback`
);
