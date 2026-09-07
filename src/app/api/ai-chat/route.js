import { NextResponse } from "next/server";
import {
  retrieveRelevantChunks,
  formatRagContext,
  generateLocalFallbackResponse,
} from "../../../lib/ragEngine";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { message, history = [] } = await req.json();

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "A valid message string is required." },
        { status: 400 }
      );
    }

    const trimmedMessage = message.trim();

    // 1. RAG Retrieval Step: Fetch top-3 relevant chunks
    const relevantChunks = retrieveRelevantChunks(trimmedMessage, 3);
    const contextText = formatRagContext(relevantChunks);
    const citations = relevantChunks.map((chunk) => ({
      id: chunk.id,
      title: chunk.title,
      category: chunk.category,
      sourceLink: chunk.sourceLink,
    }));

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      "";

    // 2. If Gemini API key is configured, stream from Google Gemini
    if (apiKey) {
      try {
        const systemInstruction = `You are "Tuser AI" — the official personal AI copilot and recruiter assistant for MD. Muttakiul Islam Tuser, a talented Full-Stack MERN & Next.js Developer based in Dhaka, Bangladesh.
Your mission is to represent Tuser accurately and warmly to recruiters, engineering managers, clients, and technical visitors.

Follow these strict rules:
1. Ground your answers in the following verified portfolio facts:
${contextText}

2. Tone: Professional, enthusiastic, articulate, tech-savvy, and concise.
3. Structure: Use Markdown bullets, bold highlights, and clean paragraphs. Keep responses under 150 words unless specifically asked for a detailed breakdown.
4. If asked about something not in the context, do not hallucinate; advise contacting Tuser directly at tusermon720@gmail.com or WhatsApp +8801760049326.
5. If the user asks for hiring or project collaboration, proactively encourage them to connect via the Quick Connect drawer or email.`;

        // Format prior history for Gemini API
        const contents = [];

        // Take last 4 turns for context window efficiency
        const recentHistory = history.slice(-4);
        recentHistory.forEach((item) => {
          if (item.role === "user" || item.role === "assistant") {
            contents.push({
              role: item.role === "assistant" ? "model" : "user",
              parts: [{ text: item.content }],
            });
          }
        });

        // Add current user prompt
        contents.push({
          role: "user",
          parts: [{ text: trimmedMessage }],
        });

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:streamGenerateContent?alt=sse&key=${apiKey}`;

        const geminiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(8000),
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemInstruction }],
            },
            contents,
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 600,
            },
          }),
        });

        if (geminiRes.ok && geminiRes.body) {
          // Stream SSE from Gemini to client
          const encoder = new TextEncoder();
          const decoder = new TextDecoder();

          const stream = new ReadableStream({
            async start(controller) {
              // Send citations first as metadata event
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "citations", citations })}\n\n`
                )
              );

              const reader = geminiRes.body.getReader();
              let buffer = "";

              try {
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;

                  buffer += decoder.decode(value, { stream: true });
                  const lines = buffer.split("\n");
                  buffer = lines.pop() || "";

                  for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith("data:")) {
                      const jsonStr = trimmedLine.replace(/^data:\s*/, "");
                      if (jsonStr) {
                        try {
                          const parsed = JSON.parse(jsonStr);
                          const text =
                            parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                          if (text) {
                            controller.enqueue(
                              encoder.encode(
                                `data: ${JSON.stringify({ type: "chunk", text })}\n\n`
                              )
                            );
                          }
                        } catch {
                          // continue reading
                        }
                      }
                    }
                  }
                }
              } catch (streamErr) {
                console.error("Stream reading error:", streamErr);
              } finally {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
                );
                controller.close();
              }
            },
          });

          return new Response(stream, {
            headers: {
              "Content-Type": "text/event-stream; charset=utf-8",
              "Cache-Control": "no-cache, no-transform",
              Connection: "keep-alive",
            },
          });
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to local RAG engine:", geminiError);
      }
    }

    // 3. Fallback: Ultra-fast local zero-cost streaming engine
    // Returns accurate chunk content directly even without any API key or during network downtime!
    const fallbackText = generateLocalFallbackResponse(trimmedMessage, relevantChunks);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Send citations metadata
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "citations", citations })}\n\n`
          )
        );

        // Stream word by word for natural feel
        const words = fallbackText.split(" ");
        for (let i = 0; i < words.length; i++) {
          const chunk = (i === 0 ? "" : " ") + words[i];
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "chunk", text: chunk })}\n\n`
            )
          );
          // 12ms delay to emulate real-time AI generation
          await new Promise((r) => setTimeout(r, 12));
        }

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
        );
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response" },
      { status: 500 }
    );
  }
}
