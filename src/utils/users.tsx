import {
    createUser,
    getUserByEmail,
    updateUser,
    verifyPassword,
} from "@/data/users";
import {
    AuthenticationError,
    EmailInUseError,
    LoginError,
    NotFoundError,
} from "./errors";
import { createAccount } from "@/data/accounts";
import { createProfile, getProfile } from "@/data/profiles";
import {
    createVerifyEmailToken,
    deleteVerifyEmailToken,
    getVerifyEmailToken,
} from "@/data/verify-email";
import { sendEmail } from "@/lib/email";
import { VerifyEmail } from "@/emails/verify-email";

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
        throw new LoginError();
    }

    const isPasswordCorrect = verifyPassword(email, password);

    if (!isPasswordCorrect) {
        throw new LoginError();
    }

    return { id: user.id, role: user.role };
}

export async function getUserProfile(userId: string) {
    const profile = await getProfile(userId);

    if (!profile) {
        throw new NotFoundError();
    }

    return profile;
}

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
