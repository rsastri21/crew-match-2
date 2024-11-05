import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import AdminSidebar from "./_components/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <main className="container px-0 grow flex items-start overflow-x-hidden">
                <AdminSidebar />
                <section className="container relative px-0 grow flex items-start">
                    <SidebarTrigger className="absolute top-2 left-2" />
                    {children}
                </section>
            </main>
        </SidebarProvider>
    );
}
