import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import ChatBubbleOutlinedIcon from "@mui/icons-material/ChatBubbleOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import { useNavigate } from "react-router-dom";

import { getPatientProfile, getPatientRoutine } from "../../api/patient";
import { getSafetyEvents } from "../../api/safety";
import { getActivityLibrary } from "../../api/activities";
import RoutineTimeline from "../../components/patient/RoutineTimeline";
import { ErrorState, LoadingState } from "../../components/common/Feedback";
import { useLoad } from "../../hooks/useLoad";
import { formatLongDate, greetingFor, preferredName } from "../../lib/format";
import type {
  ActivityLibraryResponse,
  PatientProfile,
  PatientRoutineResponse,
  SafetyEventsResponse,
} from "../../types/api";

interface HomeBundle {
  profile: PatientProfile;
  routine: PatientRoutineResponse;
  safety: SafetyEventsResponse;
  activities: ActivityLibraryResponse;
}

function loadHome(): Promise<HomeBundle> {
  return Promise.all([
    getPatientProfile(),
    getPatientRoutine(),
    getSafetyEvents(),
    getActivityLibrary(),
  ]).then(([profile, routine, safety, activities]) => ({
    profile,
    routine,
    safety,
    activities,
  }));
}

function patientSafetyCopy(safety: SafetyEventsResponse): {
  title: string;
  body: string;
  urgent: boolean;
} {
  const latest = safety.events[0];

  if (!latest) {
    return {
      title: "You're doing okay.",
      body: "Nothing needs your attention right now.",
      urgent: false,
    };
  }

  const level = latest.risk_level.toUpperCase();

  if (level === "HIGH" || latest.human_review_required) {
    return {
      title: "Let's get some human help.",
      body: "You don't have to handle this alone. A person who cares for you can take a look.",
      urgent: true,
    };
  }

  if (level === "MODERATE" || level === "MEDIUM") {
    return {
      title: "We can take this slowly.",
      body: "If something feels off, tell NeuroCompanion or ask for help.",
      urgent: false,
    };
  }

  return {
    title: "You're doing okay.",
    body: "I'm here with you.",
    urgent: false,
  };
}

export default function HomePage() {
  const navigate = useNavigate();
  const { data, loading, error, reload } = useLoad(
    loadHome,
    "Something went wrong. Let's try again.",
  );

  if (loading) {
    return <LoadingState label="Just a moment..." lines={5} />;
  }

  if (error || !data) {
    return (
      <ErrorState
        message={error ?? "Something went wrong. Let's try again."}
        onRetry={reload}
      />
    );
  }

  const name = preferredName(data.profile);
  const now = new Date();
  const safety = patientSafetyCopy(data.safety);
  const firstActivity = data.activities.activities[0];

  return (
    <Stack spacing={3.5}>
      <Box>
        <Typography variant="h1">
          {greetingFor(now)}, {name}.
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, fontSize: "1.15rem" }}>
          {formatLongDate(now)}
        </Typography>
        <Typography sx={{ mt: 1.5, fontSize: "1.25rem", color: "text.primary" }}>
          You are safe and supported. I'm right here with you.
        </Typography>
      </Box>

      <Card
        sx={{
          background:
            "linear-gradient(135deg, rgba(63,111,102,0.12), rgba(255,249,241,0.95))",
          boxShadow: "0 8px 24px rgba(47,86,80,0.06)",
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Typography variant="h2" gutterBottom>
            What would you like to do?
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<ChatBubbleOutlinedIcon />}
              onClick={() => navigate("/companion")}
              sx={{ py: 1.5, fontSize: "1.1rem" }}
            >
              Talk to NeuroCompanion
            </Button>
            <Button
              variant="outlined"
              startIcon={<CalendarMonthOutlinedIcon />}
              onClick={() => {
                document.getElementById("todays-plan")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              sx={{ py: 1.5, fontSize: "1.05rem" }}
            >
              See today's schedule
            </Button>
            <Button
              variant="outlined"
              startIcon={<SelfImprovementIcon />}
              onClick={() => navigate("/activities")}
              sx={{ py: 1.5, fontSize: "1.05rem" }}
            >
              Try a relaxing activity
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card id="todays-plan">
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Typography variant="h2">Your day</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75, mb: 2, fontSize: "1.05rem" }}>
            Here is what you have planned today. You don't have to remember everything.
          </Typography>
          {data.routine.routine.length === 0 ? (
            <Typography color="text.secondary">
              No routine items are scheduled right now.
            </Typography>
          ) : (
            <RoutineTimeline items={data.routine.routine} />
          )}
        </CardContent>
      </Card>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2.5,
        }}
      >
        <Card sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <CardContent>
            <Typography variant="h3">Memory Help</Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>
              Look at photos and stories of people you love, like Priya and Harpreet.
            </Typography>
            <Button variant="outlined" fullWidth onClick={() => navigate("/memories")}>
              Open memories
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <CardContent>
            <Typography variant="h3">Fun Activity</Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>
              {firstActivity
                ? `${firstActivity.title} (~${firstActivity.expected_duration} min)`
                : "A short, calm activity is ready whenever you'd like."}
            </Typography>
            <Button variant="outlined" fullWidth onClick={() => navigate("/activities")}>
              Let's play together
            </Button>
          </CardContent>
        </Card>

        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderColor: safety.urgent ? "error.main" : "divider",
          }}
        >
          <CardContent>
            <Typography variant="h3">
              {safety.title}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>
              {safety.body}
            </Typography>
            <Button
              variant={safety.urgent ? "contained" : "outlined"}
              color={safety.urgent ? "error" : "primary"}
              fullWidth
              onClick={() => navigate("/companion")}
            >
              {safety.urgent ? "Ask for help" : "Let's talk"}
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}
