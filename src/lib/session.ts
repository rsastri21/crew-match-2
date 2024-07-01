import "server-only";
import { cache } from "react";
import { lucia, validateRequest } from "./auth";
import { AuthenticationError } from "@/utils/errors";
import { cookies } from "next/headers";

export const getCurrentUser = cache(async () => {
    const session = await validateRequest();
    if (!session.user) {
        return undefined;
    }
    return session.user;
});

export const assertAuthenticated = async () => {
    const user = await getCurrentUser();
    if (!user) {
        throw new AuthenticationError();
    }
    return user;
};

export const setSession = async (
    userId: string,
    userRole: "user" | "production_head" | "admin"
) => {
    const session = await lucia.createSession(userId, { role: userRole });
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    );
};
