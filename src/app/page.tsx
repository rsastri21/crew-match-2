import HomePage from "@/components/home-page";
import { getCurrentUser } from "@/lib/session";
import { getDashboardUrl } from "@/utils/redirects";
import { redirect } from "next/navigation";

export default async function Home() {
    const user = await getCurrentUser();
    if (user) {
        redirect(getDashboardUrl(user.role));
    }

    return <HomePage />;
}
