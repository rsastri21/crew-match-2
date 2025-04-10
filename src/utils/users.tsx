import {
    createUser,
    getCompleteUserInfo,
    getUserByEmail,
    updateUser,
    UserRow,
    verifyPassword,
} from "@/data/users";
import {
    AccountNotFoundError,
    AuthenticationError,
    EmailInUseError,
    IncorrectAccountTypeError,
    LoginError,
    NotFoundError,
    TokenExpiredError,
} from "./errors";
import {
    createAccount,
    createAccountViaGoogle,
    createAccountViaSlack,
    getAccountByUserId,
    updatePassword,
} from "@/data/accounts";
import { createProfile, getProfile } from "@/data/profiles";
import {
    createVerifyEmailToken,
    deleteVerifyEmailToken,
    getVerifyEmailToken,
} from "@/data/verify-email";
import { sendEmail } from "@/lib/email";
import { VerifyEmail } from "@/emails/verify-email";
import { GoogleUser } from "@/app/api/login/google/callback/route";
import { SlackUser } from "@/app/api/login/slack/callback/route";
import {
    createPasswordResetToken,
    deletePasswordResetToken,
    getPasswordResetToken,
} from "@/data/reset-tokens";
import { ResetPasswordEmail } from "@/emails/reset-password";
import { cache } from "react";
import { Profile, User } from "@/db/schema";

export function transformUsersToRowModel(
    users: (User & { profile: Profile | null })[]
) {
    const transformedUsers: UserRow[] = [];

    for (const user of users) {
        transformedUsers.push({
            id: user.id,
            name: user.profile?.name ?? "",
            pronouns: user.profile?.pronouns ?? "",
            email: user.email ?? "",
            image: user.profile?.image ?? "",
            verified: !!user.emailVerified,
            role: user.role,
            isAdmin: user.isAdmin ?? false,
        });
    }

    return transformedUsers;
}

export async function registerUser(
    name: string,
    email: string,
    password: string,
    role: string
) {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        throw new EmailInUseError();
    }

    const user = await createUser(email, role);
    await createAccount(user.id, password);
    await createProfile(user.id, name);

    const token = await createVerifyEmailToken(user.id);
    await sendEmail(
        email,
        `Verify your email for Crew Match`,
        <VerifyEmail token={token} />
    );

    return { id: user.id, role: user.role };
}

export async function signInUser(email: string, password: string) {
    const user = await getUserByEmail(email);

    if (!user) {
        throw new AccountNotFoundError();
    }

    const isPasswordCorrect = await verifyPassword(email, password);

    if (!isPasswordCorrect) {
        throw new LoginError();
    }

    return { id: user.id, role: user.role };
}

export async function createGoogleUser(googleUser: GoogleUser, role: string) {
    let existingUser = await getUserByEmail(googleUser.email);

    if (!existingUser) {
        existingUser = await createUser(googleUser.email, role);
        if (googleUser.email_verified) {
            existingUser = await updateUser(existingUser.id, {
                emailVerified: new Date(),
            });
        }
    }

    await createAccountViaGoogle(existingUser.id, googleUser.sub);
    await createProfile(existingUser.id, googleUser.name, googleUser.picture);

    return existingUser;
}

export async function createSlackUser(slackUser: SlackUser, role: string) {
    let existingUser = await getUserByEmail(slackUser.email);

    if (!existingUser) {
        existingUser = await createUser(slackUser.email, role);
        if (slackUser.email_verified) {
            existingUser = await updateUser(existingUser.id, {
                emailVerified: new Date(),
            });
        }
    }

    await createAccountViaSlack(existingUser.id, slackUser.sub);
    await createProfile(existingUser.id, slackUser.name, slackUser.picture);

    return existingUser;
}

export async function getUserProfile(userId: string) {
    const profile = await getProfile(userId);

    if (!profile) {
        throw new NotFoundError();
    }

    return profile;
}

async function getUserWithCandidateProfile(userId: string) {
    const user = await getCompleteUserInfo(userId);

    if (!user) {
        throw new NotFoundError();
    }

    return user;
}

export const getUserCandidateProfile = cache(getUserWithCandidateProfile);

export async function verifyEmail(token: string) {
    const tokenEntry = await getVerifyEmailToken(token);

    if (!tokenEntry) {
        throw new AuthenticationError();
    }

    const userId = tokenEntry.userId;

    const user = await updateUser(userId, { emailVerified: new Date() });
    await deleteVerifyEmailToken(token);

    return { id: user.id, role: user.role };
}

export async function resetPassword(email: string) {
    const user = await getUserByEmail(email);

    if (!user) {
        throw new AccountNotFoundError();
    }

    const account = await getAccountByUserId(user.id);

    if (account!.accountType !== "email") {
        throw new IncorrectAccountTypeError();
    }

    const token = await createPasswordResetToken(user.id);

    await sendEmail(
        email,
        "Your password reset link for Crew Match",
        <ResetPasswordEmail token={token} />
    );
}

export async function changePassword(token: string, password: string) {
    const tokenEntry = await getPasswordResetToken(token);

    if (!tokenEntry) {
        throw new NotFoundError();
    }

    if (tokenEntry.tokenExpiresAt < new Date()) {
        throw new TokenExpiredError();
    }

    const userId = tokenEntry.userId;
    await deletePasswordResetToken(token);
    await updatePassword(userId, password);
}
