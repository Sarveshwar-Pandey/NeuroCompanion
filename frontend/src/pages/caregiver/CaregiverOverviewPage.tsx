import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

import { getCaregiverSummary } from "../../api/caregiver";
import type { CaregiverSummaryResponse } from "../../types/api";

export default function CaregiverOverviewPage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<CaregiverSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCaregiverSummary();
        setSummary(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to connect to caregiver telemetry service.",
        );
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
        <CircularProgress size={36} />
      </Box>
    );
  }

  if (error || !summary) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error ?? "No summary telemetry is available for this patient."}
      </Alert>
    );
  }

  const daily = summary.daily_events || {};
  const weekly = summary.weekly_trends || {};
  const safetyEvents = daily.safety_events ?? [];
  const activities = daily.cognitive_activity ?? [];
  const pendingTasks = daily.pending_tasks ?? [];
  const pendingReminders = daily.pending_reminders ?? [];

  // Mock weekly trends data for visualization
  const weeklyTrendData = [
    { day: "Mon", activities: 2, score: 88, safetyAlerts: 0 },
    { day: "Tue", activities: 3, score: 92, safetyAlerts: 1 },
    { day: "Wed", activities: 1, score: 75, safetyAlerts: 0 },
    { day: "Thu", activities: 2, score: 85, safetyAlerts: 0 },
    { day: "Fri", activities: 3, score: 90, safetyAlerts: 0 },
    { day: "Sat", activities: 4, score: 95, safetyAlerts: 1 },
    { day: "Sun", activities: activities.length || 2, score: 90, safetyAlerts: safetyEvents.length },
  ];

  const highRiskEvents = safetyEvents.filter(
    (e) => e.risk_level?.toUpperCase() === "HIGH" || e.human_review_required,
  );

  return (
    <Stack spacing={3.5}>
      {/* Header section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
            Care & Cognitive Status Overview
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748B", mt: 0.5 }}>
            Real-time telemetry gathered across NeuroCompanion agent interactions for Sukhvinder Sahu.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/caregiver/how-it-works")}
            sx={{ borderColor: "#CBD5E1", color: "#334155" }}
          >
            View AI Orchestrator Trace
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/caregiver/safety")}
            sx={{ backgroundColor: "#1E3A8A", "&:hover": { backgroundColor: "#1E40AF" } }}
          >
            Review Safety Log
          </Button>
        </Box>
      </Box>

      {/* Safety Alert Banner if High Risk Exists */}
      {highRiskEvents.length > 0 && (
        <Alert
          severity="warning"
          icon={<WarningAmberOutlinedIcon fontSize="inherit" />}
          action={
            <Button color="inherit" size="small" onClick={() => navigate("/caregiver/safety")}>
              Inspect Events
            </Button>
          }
          sx={{ borderRadius: 2, fontWeight: 500 }}
        >
          {highRiskEvents.length} safety observation(s) marked for caregiver attention or human review today.
        </Alert>
      )}

      {/* KPI Cards Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
          gap: 2.5,
        }}
      >
        <Card sx={{ border: "1px solid #E2E8F0", borderRadius: 2.5, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" sx={{ color: "#64748B", fontWeight: 600 }}>
                COGNITIVE SESSIONS
              </Typography>
              <InsightsOutlinedIcon sx={{ color: "#2563EB", fontSize: 22 }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mt: 1.5, color: "#0F172A" }}>
              {activities.length}
            </Typography>
            <Typography variant="caption" sx={{ color: "#10B981", fontWeight: 600 }}>
              Completed today · {weekly.cognitive_activity_count ?? 14} this week
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ border: "1px solid #E2E8F0", borderRadius: 2.5, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" sx={{ color: "#64748B", fontWeight: 600 }}>
                SAFETY OBSERVATIONS
              </Typography>
              <ShieldOutlinedIcon sx={{ color: safetyEvents.length > 0 ? "#EAB308" : "#10B981", fontSize: 22 }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mt: 1.5, color: "#0F172A" }}>
              {safetyEvents.length}
            </Typography>
            <Typography variant="caption" sx={{ color: safetyEvents.length > 0 ? "#F59E0B" : "#10B981", fontWeight: 600 }}>
              {safetyEvents.length === 0 ? "Normal baseline" : `${highRiskEvents.length} require review`}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ border: "1px solid #E2E8F0", borderRadius: 2.5, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" sx={{ color: "#64748B", fontWeight: 600 }}>
                PENDING TASKS
              </Typography>
              <CheckCircleOutlinedIcon sx={{ color: "#6366F1", fontSize: 22 }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mt: 1.5, color: "#0F172A" }}>
              {pendingTasks.length}
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748B" }}>
              Daily routine tracking active
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ border: "1px solid #E2E8F0", borderRadius: 2.5, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" sx={{ color: "#64748B", fontWeight: 600 }}>
                REMINDERS DISPATCHED
              </Typography>
              <CheckCircleOutlinedIcon sx={{ color: "#059669", fontSize: 22 }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mt: 1.5, color: "#0F172A" }}>
              {pendingReminders.length}
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748B" }}>
              Medication & hydration tracked
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Analytics Charts Section */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
          gap: 3,
        }}
      >
        {/* Weekly Activity Engagement Trend */}
        <Card sx={{ border: "1px solid #E2E8F0", borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A" }}>
                  Cognitive Engagement & Performance
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B" }}>
                  7-Day daily cognitive exercises completed and composite score
                </Typography>
              </Box>
              <Chip label="7-Day Trend" size="small" sx={{ backgroundColor: "#EFF6FF", color: "#1E40AF", fontWeight: 600 }} />
            </Box>

            <Box sx={{ height: 260, width: "100%", mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyTrendData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} />
                  <YAxis stroke="#94A3B8" fontSize={12} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1E293B",
                      border: "none",
                      borderRadius: 8,
                      color: "#FFFFFF",
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorScore)" name="Score %" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        {/* Cognitive Session Activity Distribution */}
        <Card sx={{ border: "1px solid #E2E8F0", borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A" }}>
              Activity Frequency
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B", mb: 2 }}>
              Completed sessions by day
            </Typography>
            <Box sx={{ height: 260, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} />
                  <YAxis stroke="#94A3B8" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1E293B",
                      border: "none",
                      borderRadius: 8,
                      color: "#FFFFFF",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="activities" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Completed Sessions" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Safety Observations & Routine Highlights */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        {/* Latest Safety Observations */}
        <Card sx={{ border: "1px solid #E2E8F0", borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A" }}>
                Recent Safety Logs
              </Typography>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate("/caregiver/safety")}
              >
                Full Log
              </Button>
            </Box>

            {safetyEvents.length === 0 ? (
              <Typography color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
                No active safety risks or deviations detected today.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {safetyEvents.slice(0, 3).map((event, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Chip
                        label={event.risk_level?.toUpperCase() || "OBSERVATION"}
                        size="small"
                        color={
                          event.risk_level?.toUpperCase() === "HIGH"
                            ? "error"
                            : event.risk_level?.toUpperCase() === "MEDIUM"
                            ? "warning"
                            : "default"
                        }
                        sx={{ fontWeight: 700, fontSize: "0.72rem" }}
                      />
                      <Typography variant="caption" sx={{ color: "#64748B" }}>
                        {event.created_at ? new Date(event.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Today"}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mt: 1, color: "#1E293B" }}>
                      {event.reason}
                    </Typography>
                    {event.recommended_next_step && (
                      <Typography variant="caption" sx={{ color: "#475569", display: "block", mt: 0.5 }}>
                        Recommendation: {event.recommended_next_step}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>

        {/* AI Multi-Agent Overview Card */}
        <Card sx={{ border: "1px solid #E2E8F0", borderRadius: 3, background: "linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A" }}>
              Neuro-SAN Multi-Agent Guardrails
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5, mb: 2 }}>
              6 specialized micro-agents continuously coordinate to assist Sukhvinder safely.
            </Typography>

            <Stack spacing={1.5}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Chip label="1" size="small" sx={{ width: 24, height: 24, fontWeight: 700, backgroundColor: "#E0E7FF", color: "#3730A3" }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 650, color: "#1E293B" }}>
                    Companion Conversation Agent
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Warm, reassuring dialogue with zero clinical jargon
                  </Typography>
                </Box>
              </Box>
              <Divider />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Chip label="2" size="small" sx={{ width: 24, height: 24, fontWeight: 700, backgroundColor: "#E0E7FF", color: "#3730A3" }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 650, color: "#1E293B" }}>
                    Routine & Medication Tracker
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Monitors schedule milestones without anxiety triggers
                  </Typography>
                </Box>
              </Box>
              <Divider />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Chip label="3" size="small" sx={{ width: 24, height: 24, fontWeight: 700, backgroundColor: "#FEF3C7", color: "#92400E" }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 650, color: "#1E293B" }}>
                    Continuous Safety & Risk Guardian
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Intercepts distress, confusion, and triggers human escalation
                  </Typography>
                </Box>
              </Box>
            </Stack>

            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate("/caregiver/how-it-works")}
              sx={{ mt: 3, backgroundColor: "#0F172A", "&:hover": { backgroundColor: "#1E293B" } }}
            >
              Inspect 6-Agent Execution Pipeline
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}
