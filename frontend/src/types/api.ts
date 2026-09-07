export interface PatientProfile {
  success: boolean;
  id: number;
  name: string;
  preferred_name: string | null;
  age: number;
  occupation: string | null;
  employer: string | null;
  city: string | null;
  primary_language: string | null;
}

export interface RoutineItem {
  id: number;
  title: string;
  description: string | null;
  time: string;
  duration_minutes: number | null;
  days_of_week: string;
  category: string;
}

export interface PendingTask {
  id: number;
  title: string;
  description: string | null;
  scheduled_for: string | null;
  status: string;
  priority: string;
}

export interface PendingReminder {
  id: number;
  title: string;
  remind_at: string;
  status: string;
}

export interface PatientRoutineResponse {
  success: boolean;
  user_id: number;
  routine: RoutineItem[];
  pending_tasks: PendingTask[];
  pending_reminders: PendingReminder[];
  routine_completion_tracking: boolean;
}

export interface KnownPerson {
  person_id: number;
  name: string;
  relationship: string | null;
  certainty: string;
}

export interface PatientPeopleResponse {
  success: boolean;
  user_id: number;
  count: number;
  people: KnownPerson[];
}

export interface PersonalMemory {
  memory_id: number;
  section: string;
  content: string;
  certainty: string;
  last_confirmed: string | null;
}

export interface PatientMemoriesResponse {
  success: boolean;
  user_id: number;
  count: number;
  memories: PersonalMemory[];
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  response: string;
  user_id: number;
}

export interface ActivityHistoryItem {
  activity_id: string;
  activity_type: string;
  difficulty: number;
  score: number | null;
  duration_seconds: number | null;
  outcome: string | null;
  notes: string | null;
  completed_at: string;
}

export interface ActivityHistoryResponse {
  success: boolean;
  user_id: number;
  count: number;
  history: ActivityHistoryItem[];
}

export interface ActivityDefinition {
  id: string;
  activity_type: string;
  difficulty: number;
  topic: string;
  title: string;
  expected_duration: number;
  instructions: string;
}

export interface ActivityLibraryResponse {
  success: boolean;
  count: number;
  activities: ActivityDefinition[];
}

export interface ActivityLogResponse {
  success: boolean;
  record: ActivityHistoryItem & { id?: number };
}

export interface SafetyEvent {
  event_id?: number;
  risk_level: string;
  reason: string;
  confidence?: number;
  risk_signals?: string | null;
  recommended_next_step?: string;
  human_review_required: boolean;
  created_at: string;
}

export interface SafetyEventsResponse {
  success: boolean;
  user_id: number;
  count: number;
  events: SafetyEvent[];
}

export interface CaregiverDailyEvents {
  date?: string;
  safety_events?: SafetyEvent[];
  cognitive_activity?: ActivityHistoryItem[];
  pending_tasks?: Array<Record<string, unknown>>;
  pending_reminders?: Array<Record<string, unknown>>;
  scheduled_routine?: Array<Record<string, unknown>>;
  routine_completion_tracking?: boolean;
}

export interface CaregiverWeeklyTrends {
  period_start?: string;
  period_end?: string;
  cognitive_activity_count?: number;
  average_activity_score?: number | null;
  activity_types?: string[];
  safety_event_count?: number;
  safety_events_by_risk?: Record<string, number>;
  pending_task_count?: number;
  pending_reminder_count?: number;
  routine_adherence_available?: boolean;
}

export interface CaregiverSummaryResponse {
  success: boolean;
  patient_user_id: number;
  daily_events: CaregiverDailyEvents;
  weekly_trends: CaregiverWeeklyTrends;
}

export interface CaregiverNotification {
  notification_id: number;
  caregiver_id: number;
  notification_type: string;
  title: string;
  message: string;
  priority: string;
  status: string;
  created_at: string;
}

export interface CaregiverNotificationsResponse {
  success: boolean;
  patient_user_id: number;
  count: number;
  notifications: CaregiverNotification[];
}

export interface CaregiverPreferences {
  authorized_caregiver_found: boolean;
  caregiver_id?: number;
  name?: string;
  relationship?: string;
  role?: string;
  notifications_enabled?: boolean;
  preferred_summary_frequency?: string;
  message?: string;
}

export interface CaregiverPreferencesResponse {
  success: boolean;
  patient_user_id: number;
  preferences: CaregiverPreferences;
}
