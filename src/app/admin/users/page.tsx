import PageContainer from "@/components/PageContainer";
import TopHeading from "@/components/TopHeading";
import { DataTable } from "@/components/ui/data-table";
import {
    userFilters,
    userTableColumnFactory,
} from "@/components/users-table/columns";
import { getAllUserProfiles } from "@/data/users";
import { getCurrentUser } from "@/lib/session";
import { getDashboardUrl } from "@/utils/redirects";
import { transformUsersToRowModel } from "@/utils/users";
import { redirect } from "next/navigation";

export default async function AdminUserPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    if (!user.isAdmin) {
        redirect(getDashboardUrl(user.role));
    }

    const users = await getAllUserProfiles();
    const rowUsers = transformUsersToRowModel(users);

    return (
        <PageContainer heading={<PageHeading />}>
            <DataTable
                columnGenerator={userTableColumnFactory}
                user={user}
                data={rowUsers}
                filters={userFilters}
            />
        </PageContainer>
    );
}

function PageHeading() {
    return (
        <div className="w-full pt-6 flex flex-col">
            <TopHeading text="Manage Users" />
        </div>
    );
}
