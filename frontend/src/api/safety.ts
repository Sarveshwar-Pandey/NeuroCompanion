import { request } from "./client";
import type { SafetyEventsResponse } from "../types/api";

export async function getSafetyEvents(): Promise<SafetyEventsResponse> {
  return request<SafetyEventsResponse>("/safety/events");
}
