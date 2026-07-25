"use client";

// Replaces the root layout when rendering it fails, so it cannot rely on the
// i18n provider and has to ship its own <html> and <body>.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "1.5rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Bir şeyler ters gitti</h1>
        <p style={{ color: "#666" }}>İşlem tamamlanamadı. Lütfen tekrar deneyin.</p>
        {error.digest ? (
          <code style={{ fontSize: "0.75rem", color: "#999" }}>{error.digest}</code>
        ) : null}
        <button
          onClick={reset}
          style={{
            borderRadius: "0.5rem",
            border: "1px solid #ddd",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
        >
          Tekrar dene
        </button>
      </body>
    </html>
  );
}
