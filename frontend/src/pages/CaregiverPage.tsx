import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import CaregiverNotifications from "../components/CaregiverNotifications";
import { getCaregiverSummary } from "../api/caregiver";
import type { CaregiverSummaryResponse } from "../types/api";

export default function CaregiverPage() {
  const [summary, setSummary] =
    useState<CaregiverSummaryResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadSummary() {
      try {
        const data = await getCaregiverSummary();
        setSummary(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load caregiver information.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadSummary();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 10,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  if (!summary) {
    return (
      <Alert severity="info">
        No caregiver summary is available.
      </Alert>
    );
  }

  const dailyEvents = summary.daily_events;
  const weeklyTrends = summary.weekly_trends;

  const safetyEvents =
    Array.isArray(dailyEvents.safety_events)
      ? dailyEvents.safety_events
      : [];

  const activities =
    Array.isArray(dailyEvents.cognitive_activity)
      ? dailyEvents.cognitive_activity
      : [];

  const pendingTasks =
    Array.isArray(dailyEvents.pending_tasks)
      ? dailyEvents.pending_tasks
      : [];

  const pendingReminders =
    Array.isArray(dailyEvents.pending_reminders)
      ? dailyEvents.pending_reminders
      : [];

  const weeklyActivityCount =
    typeof weeklyTrends.cognitive_activity_count === "number"
      ? weeklyTrends.cognitive_activity_count
      : 0;

  const weeklySafetyCount =
    typeof weeklyTrends.safety_event_count === "number"
      ? weeklyTrends.safety_event_count
      : 0;

  const pendingTaskCount =
    typeof weeklyTrends.pending_task_count === "number"
      ? weeklyTrends.pending_task_count
      : 0;

  const pendingReminderCount =
    typeof weeklyTrends.pending_reminder_count === "number"
      ? weeklyTrends.pending_reminder_count
      : 0;

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box>
        <Typography variant="h4">
          Sukhvinder Sahu
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Caregiver overview
        </Typography>
      </Box>

      {/* Today's status */}
      <Card>
        <CardContent>
          <Typography variant="h5">
            Today's status
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mt: 2 }}
          >
            <StatusCard
              title="Activities"
              value={activities.length}
              subtitle="recorded today"
            />

            <StatusCard
              title="Safety"
              value={safetyEvents.length}
              subtitle="events today"
            />

            <StatusCard
              title="Tasks"
              value={pendingTasks.length}
              subtitle="pending"
            />

            <StatusCard
              title="Reminders"
              value={pendingReminders.length}
              subtitle="pending"
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Recent safety observations */}
      <Card>
        <CardContent>
          <Typography variant="h5">
            Recent safety observations
          </Typography>

          <Box sx={{ mt: 2 }}>
            {safetyEvents.length === 0 ? (
              <Typography color="text.secondary">
                No safety events recorded today.
              </Typography>
            ) : (
              <Stack
                divider={<Divider />}
                spacing={2}
              >
                {safetyEvents.map(
                  (event, index) => (
                    <Box key={index}>
                      <Typography sx={{ fontWeight: 700 }}>
                        {String(
                          event.risk_level ??
                            "Observation",
                        )}
                      </Typography>

                      <Typography sx={{ mt: 0.5 }}>
                        {String(
                          event.reason ??
                            "No description available.",
                        )}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        Human review:{" "}
                        {event.human_review_required
                          ? "Recommended"
                          : "Not required"}
                      </Typography>
                    </Box>
                  ),
                )}
              </Stack>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Weekly summary */}
      <Card>
        <CardContent>
          <Typography variant="h5">
            This week
          </Typography>

          <Stack
            spacing={1.5}
            sx={{ mt: 2 }}
          >
            <Typography>
              Cognitive activities:{" "}
              <strong>{weeklyActivityCount}</strong>
            </Typography>

            <Typography>
              Safety events:{" "}
              <strong>{weeklySafetyCount}</strong>
            </Typography>

            <Typography>
              Pending tasks:{" "}
              <strong>{pendingTaskCount}</strong>
            </Typography>

            <Typography>
              Pending reminders:{" "}
              <strong>{pendingReminderCount}</strong>
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* Routine information */}
      <Card>
        <CardContent>
          <Typography variant="h5">
            Routine information
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Routine completion tracking is not currently
            available.
          </Typography>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardContent>
          <Typography variant="h5">
            Notifications
          </Typography>

          <Box sx={{ mt: 2 }}>
            <CaregiverNotifications />
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}


interface StatusCardProps {
  title: string;
  value: number;
  subtitle: string;
}


function StatusCard({
  title,
  value,
  subtitle,
}: StatusCardProps) {
  return (
    <Box
      sx={{
        flex: 1,
        p: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
      >
        {title}
      </Typography>

      <Typography
        variant="h4"
        sx={{ mt: 0.5 }}
      >
        {value}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
      >
        {subtitle}
      </Typography>
    </Box>
  );
}