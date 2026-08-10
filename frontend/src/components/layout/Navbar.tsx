// frontend/src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header className="border-b border-border bg-card px-6 py-3 flex items-center justify-between">
      <Link href="/dashboard" className="font-heading font-bold text-lg">
        PathFinder.
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/profile" className="text-xs font-medium text-muted-foreground hover:text-foreground transition">
          Profile
        </Link>
        <UserButton userProfileMode="navigation" userProfileUrl="/profile" />
      </div>
    </header>
  );
}