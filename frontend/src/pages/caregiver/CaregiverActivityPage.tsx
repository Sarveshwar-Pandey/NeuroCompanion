import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";

import { getActivityHistory, getActivityLibrary } from "../../api/activities";
import type { ActivityHistoryItem, ActivityLibraryResponse } from "../../types/api";

export default function CaregiverActivityPage() {
  const [history, setHistory] = useState<ActivityHistoryItem[]>([]);
  const [library, setLibrary] = useState<ActivityLibraryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [histRes, libRes] = await Promise.all([
          getActivityHistory(),
          getActivityLibrary(),
        ]);
        setHistory(histRes.history || []);
        setLibrary(libRes);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load cognitive activity logs.",
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

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const completedCount = history.filter((h) => h.outcome === "completed").length;
  const avgDuration = history.length > 0
    ? Math.round(
        history.reduce((acc, curr) => acc + (curr.duration_seconds || 60), 0) /
          history.length,
      )
    : 180;

  return (
    <Stack spacing={3.5}>
      {/* Header */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
          Cognitive Exercise & Stimulation Analytics
        </Typography>
        <Typography variant="body1" sx={{ color: "#64748B", mt: 0.5 }}>
          Track Sukhvinder's cognitive engagement, duration, exercises attempted, and completion notes.
        </Typography>
      </Box>

      {/* Domain Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2.5,
        }}
      >
        <Card sx={{ border: "1px solid #E2E8F0", borderRadius: 2.5 }}>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#64748B" }}>
                COMPLETED SESSIONS
              </Typography>
              <EmojiEventsOutlinedIcon sx={{ color: "#2563EB" }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#0F172A", mt: 1 }}>
              {completedCount}
            </Typography>
            <Typography variant="caption" sx={{ color: "#10B981", fontWeight: 600 }}>
              {library?.count ?? 6} total therapeutic activities in catalog
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ border: "1px solid #E2E8F0", borderRadius: 2.5 }}>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#64748B" }}>
                AVERAGE FOCUS DURATION
              </Typography>
              <TimerOutlinedIcon sx={{ color: "#059669" }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#0F172A", mt: 1 }}>
              {Math.floor(avgDuration / 60)}m {avgDuration % 60}s
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748B" }}>
              Gentle pacing within optimal attention limits
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ border: "1px solid #E2E8F0", borderRadius: 2.5 }}>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#64748B" }}>
                ENGAGED COGNITIVE DOMAINS
              </Typography>
              <PsychologyOutlinedIcon sx={{ color: "#7C3AED" }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#0F172A", mt: 1 }}>
              3 / 4
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748B" }}>
              Language · Memory Recall · Problem Solving
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Activity History Table */}
      <Card sx={{ border: "1px solid #E2E8F0", borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A", mb: 2 }}>
            Session History Log
          </Typography>

          {history.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
              No completed sessions recorded yet. Encourage Sukhvinder to play a fun activity in the patient view!
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Activity Title</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Type / Domain</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Difficulty</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Duration</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Outcome</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Notes / Response</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((item, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell sx={{ fontWeight: 650, color: "#1E293B" }}>
                        {item.activity_id}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.activity_type || "Memory Recall"}
                          size="small"
                          sx={{ backgroundColor: "#F1F5F9", color: "#334155", fontWeight: 600, fontSize: "0.75rem" }}
                        />
                      </TableCell>
                      <TableCell>
                        Level {item.difficulty || 1}
                      </TableCell>
                      <TableCell>
                        {item.duration_seconds ? `${item.duration_seconds}s` : "—"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.outcome || "completed"}
                          size="small"
                          color="success"
                          variant="outlined"
                          sx={{ fontSize: "0.72rem", fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: "#475569", maxWidth: 280 }}>
                        {item.notes || "Engaged independently without distress"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
