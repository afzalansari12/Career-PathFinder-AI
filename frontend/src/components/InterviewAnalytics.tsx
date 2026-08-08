// frontend/src/components/InterviewAnalytics.tsx
"use client";

import React, { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function InterviewAnalytics({ userId }: { userId?: string }) {
  const [data, setData] = useState<{ date: string; score: number }[]>([]);

  useEffect(() => {
    if (!userId) return;

    async function fetchScores() {
      const supabase = createClient();
      const { data: rows } = await supabase
        .from("interviews")
        .select("score, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (rows && rows.length > 0) {
        const formatted = rows.map((r, index) => ({
          date: `Attempt ${index + 1}`,
          score: r.score,
        }));
        setData(formatted);
      }
    }

    fetchScores();
  }, [userId]);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Interview Readiness Trajectory</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} />
                <YAxis domain={[0, 100]} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
            Complete a mock interview session to unlock real-time progress analytics.
          </div>
        )}
      </CardContent>
    </Card>
  );
}