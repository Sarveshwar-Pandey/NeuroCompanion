import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { getPatientProfile } from "../api/patient";
import type { PatientProfile } from "../types/api";

const routine = [
  { time: "06:30", title: "Wake up" },
  { time: "07:00", title: "Morning tea" },
  { time: "07:30", title: "Newspaper" },
  { time: "08:00", title: "Morning walk" },
  { time: "09:00", title: "Breakfast" },
];

export default function HomePage() {
  const navigate = useNavigate();

  const [profile, setProfile] =
    useState<PatientProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getPatientProfile();
        setProfile(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your profile.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadProfile();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 8,
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

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">
          Good morning,{" "}
          {profile?.name ?? "Sukhvinder"}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Let’s take today one step at a time.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Today's plan
          </Typography>

          <Stack spacing={2} sx={{ mt: 2 }}>
            {routine.map((item) => (
              <Box
                key={`${item.time}-${item.title}`}
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  p: 1,
                }}
              >
                <Typography
                  sx={{
                    minWidth: 60,
                    fontWeight: 700,
                  }}
                >
                  {item.time}
                </Typography>

                <Typography>
                  {item.title}
                </Typography>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h5">
            Companion
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1, mb: 2 }}
          >
            Ask me about your family, routine, or anything
            you would like to remember.
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate("/companion")}
          >
            Talk to NeuroCompanion
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h5">
            Today's activity
          </Typography>

          <Typography sx={{ mt: 1 }}>
            Remember a happy family moment.
          </Typography>

          <Button
            sx={{ mt: 2 }}
            variant="outlined"
          >
            Start activity
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h5">
            Safety
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            You're doing okay.
          </Typography>
           <Button
  variant="outlined"
  onClick={() => navigate("/caregiver")}
>
  Caregiver Dashboard
</Button>
        </CardContent>
      </Card>
     
    </Stack>
  );
}