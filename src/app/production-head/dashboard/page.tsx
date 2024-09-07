import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import ProductionHeadDashboardClient from "./_components/ProductionHeadDashboard.client";
import {
    getDirectorsForProductions,
    getProductionsInformation,
} from "@/utils/productions";
import { getUserCandidateProfile } from "@/utils/users";

export default async function ProductionHeadDashboard() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    if (user.role !== "production_head") {
        redirect("/user/dashboard");
    }

    const userInfo = await getUserCandidateProfile(user.id);
    const productionsWithRoles = await getProductionsInformation();
    const directors = await getDirectorsForProductions(productionsWithRoles);

    return (
        <ProductionHeadDashboardClient
            user={userInfo}
            productions={productionsWithRoles}
            directors={directors}
        />
    );
}
