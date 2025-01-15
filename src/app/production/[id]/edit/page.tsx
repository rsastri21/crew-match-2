import { getCurrentUser } from "@/lib/session";
import { getUserCandidateProfile } from "@/utils/users";
import { redirect } from "next/navigation";
import CreateProduction from "../../_components/CreateProduction.client";
import { getProductionWithRoles } from "@/data/productions";

export default async function EditProductionPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    if (user.role === "user") {
        redirect("/user/dashboard");
    }

    const userInfo = await getUserCandidateProfile(user.id);

    if (!userInfo.production) {
        redirect("/production/create");
    }

    const production = await getProductionWithRoles(userInfo.production.id);

    return (
        <div className="container py-2 flex flex-col gap-2 min-h-[80dvh] items-center mx-auto">
            <div className="px-2 py-4 w-full md:w-3/4 flex flex-col">
                <h1 className="text-3xl font-bold">Edit {production!.name}</h1>
                <p className="text-lg font-medium text-muted-foreground">
                    Modify your production. Edit general information or the
                    roles you would like to request crew members for.
                </p>
            </div>
            <CreateProduction user={userInfo} production={production!} />
        </div>
    );
}
