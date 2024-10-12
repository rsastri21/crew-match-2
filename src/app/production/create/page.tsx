import { getCurrentUser } from "@/lib/session";
import { getUserCandidateProfile } from "@/utils/users";
import { redirect } from "next/navigation";
import CreateProduction from "./_components/CreateProduction.client";

export default async function CreateProductionPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    if (user.role === "user") {
        redirect("/user/dashboard");
    }

    const userInfo = await getUserCandidateProfile(user.id);
    // TODO: Implement edit page for production at
    // route /production/[id]/edit
    if (userInfo.production) {
        redirect(`/production/${userInfo.production.id}/edit`);
    }

    return (
        <div className="container py-2 flex flex-col gap-2 min-h-[80dvh] items-center mx-auto">
            <div className="px-2 py-4 w-full md:w-3/4 flex flex-col">
                <h1 className="text-3xl font-bold">Create Production</h1>
                <p className="text-lg font-medium text-muted-foreground">
                    Get your production started. You will be able to modify
                    roles and members once the production is created.
                </p>
            </div>
            <CreateProduction user={userInfo} />
        </div>
    );
}
