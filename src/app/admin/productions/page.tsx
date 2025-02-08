import PageContainer from "@/components/PageContainer";
import {
    productionFilters,
    productionTableColumnFactory,
} from "@/components/productions-table/columns";
import TopHeading from "@/components/TopHeading";
import { DataTable } from "@/components/ui/data-table";
import { getAllProductionsWithRoles } from "@/data/productions";
import { getCurrentUser } from "@/lib/session";
import { transformProductionsToRowModel } from "@/utils/productions";
import { getDashboardUrl } from "@/utils/redirects";
import { redirect } from "next/navigation";

export default async function AdminProductionPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    if (!user.isAdmin) {
        redirect(getDashboardUrl(user.role));
    }

    const productions = await getAllProductionsWithRoles();
    const rowProductions = await transformProductionsToRowModel(productions);

    return (
        <PageContainer heading={<PageHeading />}>
            <DataTable
                columnGenerator={productionTableColumnFactory}
                user={user}
                data={rowProductions}
                filters={productionFilters}
            />
        </PageContainer>
    );
}

function PageHeading() {
    return (
        <div className="w-full pt-6 flex flex-col">
            <TopHeading text="Manage Productions" />
        </div>
    );
}
