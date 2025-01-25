"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { QCProvider } from "./query-client-provider";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <QCProvider>{children}</QCProvider>
        </ThemeProvider>
    );
}
