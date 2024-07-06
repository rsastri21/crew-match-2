import { getAccountByGoogleId, getAccountBySlackId } from "@/data/accounts";

export async function getAccountByGoogleIdUseCase(googleId: string) {
    return await getAccountByGoogleId(googleId);
}

export async function getAccountBySlackIdUseCase(slackId: string) {
    return await getAccountBySlackId(slackId);
}
