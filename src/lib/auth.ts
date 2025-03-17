import "dotenv";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import type { Session, User } from "@/db/schema";
import { Google, Slack } from "arctic";
import {
    encodeBase32LowerCaseNoPadding,
    encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { eq } from "drizzle-orm";
import { getSessionToken } from "./session";

const SESSION_EXPIRY_TIME = 1000 * 60 * 60 * 24 * 30; // 30 days

export type SessionValidationResult =
    | { session: Session; user: User }
    | { session: null; user: null };

export const generateSessionToken = (): string => {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
};

export const createSession = async (
    token: string,
    userId: string
): Promise<Session> => {
    const sessionId = encodeHexLowerCase(
        sha256(new TextEncoder().encode(token))
    );
    const session: Session = {
        id: sessionId,
        userId,
        expiresAt: new Date(Date.now() + SESSION_EXPIRY_TIME),
    };
    await db.insert(sessions).values(session);
    return session;
};

export const invalidateSession = async (sessionId: string): Promise<void> => {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
};

export const validateSessionToken = async (
    token: string
): Promise<SessionValidationResult> => {
    const sessionId = encodeHexLowerCase(
        sha256(new TextEncoder().encode(token))
    );
    const sessionInDb = await db.query.sessions.findFirst({
        where: eq(sessions.id, sessionId),
    });

    console.log({ token });
    console.log({ id: sessionInDb?.id });

    if (!sessionInDb) {
        return { session: null, user: null };
    }

    console.log("Date.now()", Date.now());
    console.log("DB date time", sessionInDb.expiresAt.getTime());
    // Invalidate session if it is expired
    if (Date.now() >= sessionInDb.expiresAt.getTime()) {
        await invalidateSession(sessionId);
        return { session: null, user: null };
    }

    const user = await db.query.users.findFirst({
        where: eq(users.id, sessionInDb.userId),
    });

    if (!user) {
        await invalidateSession(sessionId);
        return { session: null, user: null };
    }

    // Refresh session if nearing expiration
    if (
        Date.now() >=
        sessionInDb.expiresAt.getTime() - SESSION_EXPIRY_TIME / 2
    ) {
        sessionInDb.expiresAt = new Date(Date.now() + SESSION_EXPIRY_TIME);
        await db
            .update(sessions)
            .set({ expiresAt: sessionInDb.expiresAt })
            .where(eq(sessions.id, sessionId));
    }
    return { session: sessionInDb, user };
};

export const validateRequest = async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
> => {
    const sessionToken = getSessionToken();
    if (!sessionToken) {
        return {
            user: null,
            session: null,
        };
    }
    return validateSessionToken(sessionToken);
};

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
