"use client";

import { useState } from "react";
import { Lightbulb, Loader2, Send } from "lucide-react";
import { Card } from "./card";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export interface Suggestion {
  id: string;
  message: string;
  userId: string;
  createdAt: string;
}

const MAX_LENGTH = 1000;

export function SuggestionBox() {
  const { token } = useAuth();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const canSend = message.trim().length > 0 && !sending;

  const send = async () => {
    const text = message.trim();
    if (!text || sending) return;
    setSending(true);
    setFeedback(null);
    try {
      await api<Suggestion>("/suggestions", {
        method: "POST",
        body: JSON.stringify({ message: text }),
        token,
      });
      setMessage("");
      setFeedback({
        type: "success",
        text: "¡Gracias por tu sugerencia! La tendremos en cuenta para mejorar la app.",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text:
          err instanceof ApiError
            ? err.message
            : "No se pudo enviar la sugerencia. Intenta de nuevo.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
          <Lightbulb className="size-4" />
        </span>
        <div>
          <h3 className="font-semibold">Buzón de sugerencias</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Envíanos tus opiniones o ideas para mejorar la app
          </p>
        </div>
      </div>

      <textarea
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          setFeedback(null);
        }}
        maxLength={MAX_LENGTH}
        rows={4}
        placeholder="Escribe aquí tu sugerencia..."
        className="mt-4 w-full resize-none rounded-lg border border-zinc-300 bg-transparent p-3 text-sm outline-none placeholder:text-zinc-400 focus:border-emerald-500 dark:border-zinc-700 dark:placeholder:text-zinc-500"
      />

      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-xs tabular-nums text-zinc-400 dark:text-zinc-500">
          {message.length}/{MAX_LENGTH}
        </span>
        <button
          type="button"
          onClick={() => void send()}
          disabled={!canSend}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-60"
        >
          {sending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="size-4" />
              Enviar
            </>
          )}
        </button>
      </div>

      {feedback && (
        <p
          role="status"
          className={`mt-3 text-sm ${
            feedback.type === "success" ? "text-emerald-500" : "text-rose-500"
          }`}
        >
          {feedback.text}
        </p>
      )}
    </Card>
  );
}
