import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import { getCaregiverNotifications, getCaregiverPreferences } from "../../api/caregiver";
import type { CaregiverNotification, CaregiverPreferences } from "../../types/api";

export default function CaregiverNotificationsPage() {
  const [notifications, setNotifications] = useState<CaregiverNotification[]>([]);
  const [prefs, setPrefs] = useState<CaregiverPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    async function load() {
      try {
        const [notifRes, prefRes] = await Promise.all([
          getCaregiverNotifications(),
          getCaregiverPreferences(),
        ]);
        setNotifications(notifRes.notifications || []);
        setPrefs(prefRes.preferences || null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load notification alerts.",
        );
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const markAllRead = () => {
    const allIds = new Set(notifications.map((n) => n.notification_id));
    setReadIds(allIds);
  };

  const toggleRead = (id: number) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
        <CircularProgress size={36} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const unreadCount = notifications.filter((n) => !readIds.has(n.notification_id)).length;

  return (
    <Stack spacing={3.5}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
            Alerts, Reminders & Care Notifications
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748B", mt: 0.5 }}>
            Automated alerts triggered by routine schedules, safety checks, and patient interactions.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            sx={{ borderColor: "#CBD5E1", color: "#334155" }}
          >
            Mark All as Read
          </Button>
        </Box>
      </Box>

      {/* Grid: Notifications + Preferences */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: 3,
        }}
      >
        {/* Alerts List */}
        <Card sx={{ border: "1px solid #E2E8F0", borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A" }}>
                  Active Alerts ({unreadCount} unread)
                </Typography>
              </Box>
              <Chip
                label={unreadCount > 0 ? "Requires Attention" : "All Caught Up"}
                size="small"
                color={unreadCount > 0 ? "warning" : "success"}
                sx={{ fontWeight: 700, fontSize: "0.72rem" }}
              />
            </Box>

            {notifications.length === 0 ? (
              <Box sx={{ py: 6, textAlign: "center" }}>
                <CheckCircleOutlinedIcon sx={{ fontSize: 44, color: "#10B981", mb: 1 }} />
                <Typography color="text.secondary">
                  No active notifications or alerts at this time.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2} divider={<Divider />}>
                {notifications.map((item) => {
                  const isRead = readIds.has(item.notification_id);
                  const isHigh = item.priority?.toUpperCase() === "HIGH";

                  return (
                    <Box
                      key={item.notification_id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: isRead ? "#FFFFFF" : isHigh ? "rgba(239, 68, 68, 0.04)" : "#F8FAFC",
                        border: isRead ? "1px solid #F1F5F9" : isHigh ? "1px solid #FECACA" : "1px solid #E2E8F0",
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                          <NotificationsActiveOutlinedIcon
                            sx={{
                              color: isHigh ? "#DC2626" : "#3B82F6",
                              mt: 0.25,
                              fontSize: 22,
                            }}
                          />
                          <Box>
                            <Typography sx={{ fontWeight: 700, color: "#0F172A" }}>
                              {item.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#475569", mt: 0.5 }}>
                              {item.message}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#94A3B8", mt: 1, display: "block" }}>
                              {item.created_at ? new Date(item.created_at).toLocaleString() : "Just now"} · Category: {item.notification_type || "Routine"}
                            </Typography>
                          </Box>
                        </Box>

                        <Button
                          size="small"
                          variant="text"
                          onClick={() => toggleRead(item.notification_id)}
                          sx={{ fontSize: "0.75rem", whiteSpace: "nowrap", color: "#64748B" }}
                        >
                          {isRead ? "Mark Unread" : "Dismiss"}
                        </Button>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            )}
          </CardContent>
        </Card>

        {/* Dispatch Preferences Card */}
        <Card sx={{ border: "1px solid #E2E8F0", borderRadius: 3, height: "fit-content" }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <SettingsOutlinedIcon sx={{ color: "#475569" }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A" }}>
                Dispatch Channel Settings
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              Authorized Caregiver: <strong>{prefs?.name || "Dr. Harpreet Sahu (Son)"}</strong>
            </Typography>

            <Stack spacing={2}>
              <FormControlLabel
                control={<Switch defaultChecked color="primary" />}
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 650 }}>
                      Instant Safety Escalations
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      SMS & Push alert if HIGH risk event detected
                    </Typography>
                  </Box>
                }
              />
              <Divider />
              <FormControlLabel
                control={<Switch defaultChecked color="primary" />}
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 650 }}>
                      Medication Window Missed
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Notify after 45 minutes of scheduled time
                    </Typography>
                  </Box>
                }
              />
              <Divider />
              <FormControlLabel
                control={<Switch defaultChecked color="primary" />}
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 650 }}>
                      Daily Evening Digest
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Summary email at 8:00 PM every evening
                    </Typography>
                  </Box>
                }
              />
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}
