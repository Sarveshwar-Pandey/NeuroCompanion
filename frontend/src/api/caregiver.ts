import { request } from "./client";

import type {
  CaregiverNotificationsResponse,
  CaregiverPreferencesResponse,
  CaregiverSummaryResponse,
} from "../types/api";

export async function getCaregiverSummary(): Promise<CaregiverSummaryResponse> {
  return request<CaregiverSummaryResponse>("/caregiver/summary");
}

export async function getCaregiverNotifications(): Promise<CaregiverNotificationsResponse> {
  return request<CaregiverNotificationsResponse>(
    "/caregiver/notifications",
  );
}

export async function getCaregiverPreferences(): Promise<CaregiverPreferencesResponse> {
  return request<CaregiverPreferencesResponse>("/caregiver/preferences");
}
