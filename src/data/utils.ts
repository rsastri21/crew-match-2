import { db } from "@/db";
import crypto from "crypto";

const ITERATIONS = 10000;

export async function generateRandomToken(length: number) {
    const buffer = await new Promise<Buffer>((resolve, reject) => {
        crypto.randomBytes(Math.ceil(length / 2), (err, buf) => {
            if (err !== null) {
                reject(err);
            } else {
                resolve(buf);
            }
        });
    });

    return buffer.toString("hex").slice(0, length);
}

export async function hashPassword(plainTextPassword: string, salt: string) {
    return new Promise<string>((resolve, reject) => {
        crypto.pbkdf2(
            plainTextPassword,
            salt,
            ITERATIONS,
            64,
            "sha512",
            (err, derivedKey) => {
                if (err) reject(err);
                resolve(derivedKey.toString("hex"));
            }
        );
    });
}

export async function createTransaction<T extends typeof db>(
    callback: (trx: T) => void
) {
    await db.transaction(callback as any);
}
