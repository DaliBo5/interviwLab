"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  author: "interviewer" | "candidate";
  content: string;
};

type Props = {
  interviewId: string;
  maxQuestions: number;
  initialQuestionCount: number;
  initialMessages: ChatMessage[];
};

export default function InterviewChat({
  interviewId,
  maxQuestions,
  initialQuestionCount,
  initialMessages,
}: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [questionCount, setQuestionCount] = useState(initialQuestionCount);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "thinking" | "reporting">("idle");
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const busy = status !== "idle";
  const isLastQuestion = questionCount >= maxQuestions;

  async function sendAnswer() {
    const content = input.trim();
    if (!content || busy) return;

    setError(null);
    setInput("");
    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [...prev, { id: tempId, author: "candidate", content }]);
    setStatus(isLastQuestion ? "reporting" : "thinking");

    try {
      const res = await fetch(`/api/interviews/${interviewId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = (await res.json()) as {
        done?: boolean;
        message?: { id: string; content: string };
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de l'envoi");

      if (data.done) {
        router.push(`/report/${interviewId}`);
        return;
      }
      if (data.message) {
        const next = data.message;
        setMessages((prev) => [
          ...prev,
          { id: next.id, author: "interviewer", content: next.content },
        ]);
        setQuestionCount((n) => n + 1);
      }
      setStatus("idle");
    } catch (err) {
      // On retire la réponse optimiste et on la remet dans le champ
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setInput(content);
      setError(err instanceof Error ? err.message : "Erreur inattendue");
      setStatus("idle");
    }
  }

  async function finishNow() {
    if (busy) return;
    setError(null);
    setStatus("reporting");
    try {
      const res = await fetch(`/api/interviews/${interviewId}/finish`, { method: "POST" });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Impossible de générer le rapport");
      router.push(`/report/${interviewId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue");
      setStatus("idle");
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Ctrl+Entrée (ou Cmd+Entrée) pour envoyer
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      void sendAnswer();
    }
  }

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2 text-sm">
        <span className="text-slate-600">
          Question {Math.min(questionCount, maxQuestions)} / {maxQuestions}
        </span>
        <div className="h-2 w-40 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-brand-500 transition-all"
            style={{ width: `${(Math.min(questionCount, maxQuestions) / maxQuestions) * 100}%` }}
          />
        </div>
      </div>

      <div className="h-[55vh] space-y-4 overflow-y-auto p-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.author === "candidate" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.author === "candidate"
                  ? "rounded-br-sm bg-brand-600 text-white"
                  : "rounded-bl-sm bg-slate-100 text-slate-900"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {status === "thinking" && (
          <p className="text-sm italic text-slate-500">Le recruteur réfléchit…</p>
        )}
        {status === "reporting" && (
          <p className="text-sm italic text-slate-500">
            Entretien terminé. Analyse de tes réponses et rédaction du rapport…
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="space-y-2 border-t border-slate-200 p-4">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={busy}
          rows={4}
          placeholder="Ta réponse… (Ctrl+Entrée pour envoyer)"
          className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none disabled:bg-slate-50"
        />
        <div className="flex justify-between gap-2">
          <button
            type="button"
            onClick={finishNow}
            disabled={busy || !messages.some((m) => m.author === "candidate")}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            Terminer maintenant
          </button>
          <button
            type="button"
            onClick={sendAnswer}
            disabled={busy || !input.trim()}
            className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {isLastQuestion ? "Envoyer et voir le rapport" : "Envoyer"}
          </button>
        </div>
      </div>
    </div>
  );
}
