import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile";

export async function streamGroq(prompt: string, system?: string): Promise<ReadableStream> {
  const messages: Groq.Chat.ChatCompletionMessageParam[] = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: prompt });

  const stream = await groq.chat.completions.create({
    model: MODEL,
    messages,
    stream: true,
    max_tokens: 1800,
  });

  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) controller.enqueue(encoder.encode(text));
        }
      } finally {
        controller.close();
      }
    },
  });
}

export async function callGroq(prompt: string, system?: string): Promise<string> {
  const messages: Groq.Chat.ChatCompletionMessageParam[] = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: prompt });

  const res = await groq.chat.completions.create({
    model: MODEL,
    messages,
    max_tokens: 1800,
  });
  return res.choices[0]?.message?.content ?? "";
}
