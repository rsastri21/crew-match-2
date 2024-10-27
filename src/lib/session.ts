import "server-only";
import "dotenv";
import { cache } from "react";
import { createSession, generateSessionToken, validateRequest } from "./auth";
import { AuthenticationError } from "@/utils/errors";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "session";

export const setSessionTokenCookie = (token: string, expiresAt: Date): void => {
    cookies().set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires: expiresAt,
        path: "/",
    });
};

export const deleteSessionTokenCookie = (): void => {
    cookies().set(SESSION_COOKIE_NAME, "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 0,
        path: "/",
    });
};

export const getSessionToken = (): string | undefined => {
    return cookies().get(SESSION_COOKIE_NAME)?.value;
};

export const getCurrentUser = cache(async () => {
    const { user } = await validateRequest();
    return user ?? undefined;
});

export const assertAuthenticated = async () => {
    const user = await getCurrentUser();
    if (!user) {
        throw new AuthenticationError();
    }
    return user;
};

export const setSession = async (userId: string) => {
    const token = generateSessionToken();
    const session = await createSession(token, userId);
    setSessionTokenCookie(token, session.expiresAt);
};
