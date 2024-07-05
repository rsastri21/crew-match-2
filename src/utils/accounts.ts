import { getAccountByGoogleId } from "@/data/accounts";

export async function getAccountByGoogleIdUseCase(googleId: string) {
    return await getAccountByGoogleId(googleId);
}
