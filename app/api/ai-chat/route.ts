import { NextRequest } from "next/server";

export const runtime = "nodejs";

type ChatPayload = {
  messages?: Array<{ role?: string; content?: string }>;
  context?: {
    user?: {
      fullName?: string;
      location?: string;
      favoritesCount?: number;
      joinedProjectsCount?: number;
      createdProjectsCount?: number;
    };
    questionnaireAnswers?: Record<string, string>;
    selectedProject?: string | null;
    globalChatOptIn?: boolean;
  };
};

function buildReply(payload: ChatPayload) {
  const latestUserMessage =
    [...(payload.messages || [])].reverse().find((message) => message.role === "user")
      ?.content || "";

  const location = payload.context?.user?.location || "your current location";
  const joinedProjectsCount = payload.context?.user?.joinedProjectsCount ?? 0;
  const favoritesCount = payload.context?.user?.favoritesCount ?? 0;
  const selectedProject = payload.context?.selectedProject;
  const projectType = payload.context?.questionnaireAnswers?.project_type;

  return [
    "## Assistant response",
    "",
    `You asked: **${latestUserMessage || "no prompt provided"}**`,
    "",
    "Here is a structured next-step response for Prototype 6:",
    "",
    `- You are currently centered around **${location}**.`,
    `- You already have **${joinedProjectsCount} joined project${joinedProjectsCount === 1 ? "" : "s"}** in your workspace.`,
    `- You have **${favoritesCount} saved favorite${favoritesCount === 1 ? "" : "s"}**.`,
    `- Your current project focus appears to be **${projectType || "still being defined"}**.`,
    ...(selectedProject ? [`- The selected project in context is **${selectedProject}**.`] : []),
    "",
    "### Suggested actions",
    "- Open the most relevant joined project chat if you need human coordination.",
    "- Message a project owner directly if you need approvals or practical details.",
    "- Use global community chat only if the question benefits from broader visibility.",
    "",
    "```ts",
    "// Later, replace this mock route with OpenAI or another LLM provider.",
    "// Example shape: messages + app context -> model -> streamed tokens back to the UI.",
    'const provider = "openai-or-other-llm";',
    "```",
    "",
    "If you want, I can also help compare projects, write a message for a project owner, or suggest whether to ask the community or go directly to a person.",
  ].join("\n");
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as ChatPayload;
  const reply = buildReply(body);

  // Insert API key usage and real provider logic here later.
  // Example:
  // const apiKey = process.env.OPENAI_API_KEY;
  // call provider with messages + context and stream the tokens.

  const encoder = new TextEncoder();
  const chunks = reply.match(/.{1,32}(\s|$)/g) || [reply];

  const stream = new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
        await new Promise((resolve) => setTimeout(resolve, 35));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
