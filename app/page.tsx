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
        console.log("Realtime payload:", payload)
        setMessages((prev) => [...prev, payload.new])
      }
    )
    .subscribe((status) => {
      console.log("Realtime status:", status)
    })

  return () => {
    supabase.removeChannel(channel)
  }
}, [])
