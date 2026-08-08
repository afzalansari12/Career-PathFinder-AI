"use client";

import { useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { useSupabase } from "@/lib/supabase";

export default function Home() {
  const { user } = useUser();
  const supabase = useSupabase();   // ✅ Here

  useEffect(() => {
    if (!user) return;

    const testSupabase = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*");

      console.log("DATA:", data);
      console.log("ERROR:", error);
    };

    testSupabase();
  }, [user, supabase]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-5xl font-bold">CareerPath AI 🚀</h1>
      <UserButton />
    </main>
  );
}