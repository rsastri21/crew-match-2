import { createUser, getUserByEmail, updateUser } from "@/data/users";
import { AuthenticationError, EmailInUseError } from "./errors";
import { createAccount } from "@/data/accounts";
import { createProfile } from "@/data/profiles";
import {
    createVerifyEmailToken,
    deleteVerifyEmailToken,
    getVerifyEmailToken,
} from "@/data/verify-email";
import { sendEmail } from "@/lib/email";
import { VerifyEmail } from "@/emails/verify-email";
import { createTransaction } from "@/data/utils";

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
