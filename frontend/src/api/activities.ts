import { request } from "./client";
import type {
  ActivityHistoryResponse,
  ActivityLibraryResponse,
  ActivityLogResponse,
} from "../types/api";

export async function getActivityHistory(): Promise<ActivityHistoryResponse> {
  return request<ActivityHistoryResponse>("/activities/history");
}

export async function getActivityLibrary(): Promise<ActivityLibraryResponse> {
  return request<ActivityLibraryResponse>("/activities/library");
}

export async function logActivityPerformance(input: {
  activity_id: string;
  notes?: string;
  duration_seconds?: number;
  outcome?: string;
}): Promise<ActivityLogResponse> {
  return request<ActivityLogResponse>("/activities/log", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
