import { request } from "./client";
import type {
  PatientMemoriesResponse,
  PatientPeopleResponse,
  PatientProfile,
  PatientRoutineResponse,
} from "../types/api";

export async function getPatientProfile(): Promise<PatientProfile> {
  return request<PatientProfile>("/patient/profile");
}

export async function getPatientRoutine(): Promise<PatientRoutineResponse> {
  return request<PatientRoutineResponse>("/patient/routine");
}

export async function getPatientPeople(): Promise<PatientPeopleResponse> {
  return request<PatientPeopleResponse>("/patient/people");
}

export async function getPatientMemories(): Promise<PatientMemoriesResponse> {
  return request<PatientMemoriesResponse>("/patient/memories");
}
