import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import DocsSidebar from "./_components/DocsSidebar";

export default function DocsLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <main className="container px-0 flex items-start overflow-x-hidden">
                <DocsSidebar />
                <section className="container relative px-0 grow flex max-h-[calc(100vh-72px)] overflow-y-scroll">
                    <SidebarTrigger className="absolute top-2 left-2" />
                    <section className="w-full max-w-[80ch] h-full mx-auto space-y-6">
                        <div className="w-full h-full px-6">{children}</div>
                    </section>
                </section>
            </main>
        </SidebarProvider>
    );
}
