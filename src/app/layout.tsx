import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import { Header } from "./_header/header";
import { Providers } from "./_providers/providers";
import { Toaster } from "@/components/ui/toaster";
import Footer from "./_footer/footer";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: "Crew Match",
    description: "The next generation of LUX Crew Match",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn(
                    "flex flex-col bg-background font-sans antialiased overflow-hidden",
                    fontSans.variable
                )}
            >
                <Providers>
                    <Header />
                    <div className="max-h-[calc(100vh-72px)] overflow-y-scroll pb-12">
                        {children}
                        <Footer />
                    </div>
                </Providers>
                <Toaster />
            </body>
        </html>
    );
}
