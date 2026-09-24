"use client";

import { useState } from "react";

export function CodeCopy({ text }: { text: string }) {
  const [status, setStatus] = useState("Copy code");
  return (
    <button
      className="min-h-11 rounded-md px-3 text-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      data-streamdown="code-block-copy-button"
      onBlur={() => setStatus("Copy code")}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setStatus("Copied");
        } catch {
          setStatus("Select code to copy");
        }
      }}
      type="button"
    >
      <span aria-live="polite">{status}</span>
    </button>
  );
}
