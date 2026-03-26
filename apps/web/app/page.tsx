"use client";

import { AgentRunner } from "@/components/AgentRunner";

export default function Page() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a0a0a",
        color: "#ededed",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          padding: "20px",
          borderBottom: "1px solid #333",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
        }}
      >
        <h1
          style={{
            fontSize: "1.2rem",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          MANDATE SYSTEM AGENTS
        </h1>
      </header>

      <main style={{ flex: 1, padding: "20px" }}>
        <AgentRunner />
      </main>
    </div>
  );
}
