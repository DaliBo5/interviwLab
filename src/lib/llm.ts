// Client minimal pour toute API compatible OpenAI (Groq, OpenAI, Mistral, Ollama...).

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ChatOptions = {
  json?: boolean;
  temperature?: number;
};

export async function chat(messages: ChatMessage[], options: ChatOptions = {}): Promise<string> {
  const baseUrl = process.env.LLM_BASE_URL ?? "https://api.openai.com/v1";
  const model = process.env.LLM_MODEL ?? "gpt-4o-mini";
  const apiKey = process.env.LLM_API_KEY;

  if (!apiKey || apiKey === "colle_ta_cle_ici") {
    throw new Error("LLM_API_KEY manquante : ajoute ta clé dans le fichier .env");
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      ...(options.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Erreur de l'API LLM (${response.status}) : ${detail}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Réponse vide de l'API LLM");
  }
  return content.trim();
}
