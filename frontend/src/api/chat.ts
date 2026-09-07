import { request } from "./client";
import type { ChatResponse } from "../types/api";

export async function sendChatMessage(
  message: string,
): Promise<ChatResponse> {
  return request<ChatResponse>("/chat", {
    method: "POST",
    body: JSON.stringify({
      message,
    }),
  });
}
