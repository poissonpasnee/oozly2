"use client";

import { useEffect, useState } from "react";
import { supabase } from "../src/lib/supabase";

export default function Page() {
  const [status, setStatus] = useState<string>("init");
  const [url, setUrl] = useState<string>("");
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    setUrl(String(process.env.NEXT_PUBLIC_SUPABASE_URL || "undefined"));

    const channel = supabase
      .channel("db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public" },
        (payload) => {
          // On garde TOUT le payload, pas فقط payload.new
          setEvents((prev) => [payload, ...prev].slice(0, 20));
        }
      )
      .subscribe((s) => setStatus(s));

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 44, margin: 0 }}>Realtime Test</h1>

      <div style={{ marginTop: 12 }}>
        <div>
          <b>Status:</b> {status}
        </div>
        <div style={{ wordBreak: "break-all" }}>
          <b>Supabase URL:</b> {url}
        </div>
        <div style={{ marginTop: 10 }}>
          <b>Events reçus:</b> {events.length}
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        {events.length === 0 ? (
          <div>Aucun event reçu.</div>
        ) : (
          events.map((e, idx) => (
            <pre
              key={idx}
              style={{
                padding: 12,
                border: "1px solid #ddd",
                borderRadius: 8,
                overflowX: "auto",
                marginBottom: 12,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {JSON.stringify(e, null, 2)}
            </pre>
          ))
        )}
      </div>
    </main>
  );
}
