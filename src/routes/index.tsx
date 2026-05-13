import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/index.html");
  }, []);
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <a href="/index.html">Apri il sito Growing Knowledge →</a>
    </div>
  );
}
