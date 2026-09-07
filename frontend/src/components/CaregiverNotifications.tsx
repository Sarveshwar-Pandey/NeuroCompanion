import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import { getCaregiverNotifications } from "../api/caregiver";

interface Notification {
  notification_id?: number;
  caregiver_id?: number;
  notification_type?: string;
  title?: string;
  message?: string;
  priority?: string;
  status?: string;
  created_at?: string;
}

export default function CaregiverNotifications() {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const response =
          await getCaregiverNotifications();

        setNotifications(
          response.notifications as Notification[],
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load notifications.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadNotifications();
  }, []);

  if (loading) {
    return (
      <Box sx={{ py: 3 }}>
        <CircularProgress size={24} />
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
    <Box>
      {notifications.length === 0 ? (
        <Typography color="text.secondary">
          No caregiver notifications yet.
        </Typography>
      ) : (
        <Stack divider={<Divider />} spacing={2}>
          {notifications.map(
            (notification, index) => (
              <Box key={notification.notification_id ?? index}>
                <Typography sx={{ fontWeight: 700 }}>
                  {notification.title ??
                    "Caregiver notification"}
                </Typography>

                <Typography sx={{ mt: 0.5 }}>
                  {notification.message ?? ""}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Priority:{" "}
                  {notification.priority ?? "normal"}
                  {" • "}
                  Status:{" "}
                  {notification.status ?? "unknown"}
                </Typography>
              </Box>
            ),
          )}
        </Stack>
      )}
    </Box>
  );
}