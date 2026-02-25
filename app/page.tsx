"use client";

import { useEffect, useState } from "react";
import { supabase } from "../src/lib/supabase";

export default function Page() {
  const [status, setStatus] = useState<string>("init");
  const [url, setUrl] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
  const channel = supabase.channel("db-changes");

  channel.on(
    "postgres_changes",
    {
      event: "*",
      schema: "public"
    },
    (payload) => {
      console.log("PAYLOAD:", payload);
      setMessages((prev) => [...prev, payload.new]);
    }
  );

  channel.subscribe((status) => {
    setStatus(status);
  });

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 36, marginBottom: 12 }}>Realtime Test</h1>

      <div style={{ marginBottom: 16 }}>
        <div>
          <b>Status:</b> {status}
        </div>
        <div style={{ wordBreak: "break-all" }}>
          <b>Supabase URL:</b> {url}
        </div>
      </div>

      <h2 style={{ fontSize: 18, marginBottom: 8 }}>Messages reçus (INSERT)</h2>
      {messages.length === 0 ? (
        <div>Aucun message reçu.</div>
      ) : (
        messages.map((m) => (
          <div key={m.id} style={{ padding: 8, border: "1px solid #ddd", marginBottom: 8 }}>
            {m.content}
          </div>
        ))
      )}
    </main>
  );
}
