'use client'

import Header from "@/components/ui/header";
import { SessionProvider } from "next-auth/react";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Header />
      {children}
    </SessionProvider>
  );
}