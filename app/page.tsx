"use client"

import { useEffect, useState } from "react"
import { supabase } from "../src/lib/supabase"

export default function Page() {
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    const channel = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages"
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <main style={{ padding: 24 }}>
      <h1>Realtime Test</h1>
      {messages.map((m) => (
        <div key={m.id}>{m.content}</div>
      ))}
    </main>
  )
}
