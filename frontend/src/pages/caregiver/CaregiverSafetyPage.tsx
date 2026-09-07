import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

import { getSafetyEvents } from "../../api/safety";
import type { SafetyEvent, SafetyEventsResponse } from "../../types/api";

export default function CaregiverSafetyPage() {
  const [data, setData] = useState<SafetyEventsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRisk, setFilterRisk] = useState<string>("ALL");
  const [selectedEvent, setSelectedEvent] = useState<SafetyEvent | null>(null);
  const [reviewedEvents, setReviewedEvents] = useState<Set<number>>(new Set());

  useEffect(() => {
    async function load() {
      try {
        const res = await getSafetyEvents();
        setData(res);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch safety telemetry.",
        );
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const handleReviewConfirm = () => {
    if (selectedEvent && selectedEvent.event_id) {
      setReviewedEvents((prev) => new Set(prev).add(selectedEvent.event_id!));
    }
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
        <CircularProgress size={36} />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Alert severity="error">
        {error ?? "Unable to retrieve safety audit events."}
      </Alert>
    );
  }

  const events = data.events || [];
  const filteredEvents = events.filter((e) => {
    if (filterRisk === "ALL") return true;
    return e.risk_level?.toUpperCase() === filterRisk;
  });

  const highCount = events.filter((e) => e.risk_level?.toUpperCase() === "HIGH").length;
  const mediumCount = events.filter((e) => e.risk_level?.toUpperCase() === "MEDIUM").length;
  const lowCount = events.filter((e) => e.risk_level?.toUpperCase() === "LOW").length;

  return (
    <Stack spacing={3.5}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
            Safety Oversight & Risk Guardrails
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748B", mt: 0.5 }}>
            Audit trail of potential disorientation, agitation, wandering risks, and escalation events.
          </Typography>
        </Box>
      </Box>

      {/* Triage Status Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2.5,
        }}
      >
        <Card sx={{ border: "1px solid #FECACA", backgroundColor: "#FEF2F2", borderRadius: 2.5 }}>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#991B1B" }}>
                HIGH RISK / ESCALATIONS
              </Typography>
              <WarningAmberOutlinedIcon sx={{ color: "#DC2626" }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#991B1B", mt: 1 }}>
              {highCount}
            </Typography>
            <Typography variant="caption" sx={{ color: "#7F1D1D" }}>
              Requires immediate human review & attention
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ border: "1px solid #FEF08A", backgroundColor: "#FEFCE8", borderRadius: 2.5 }}>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#854D0E" }}>
                MODERATE OBSERVATIONS
              </Typography>
              <ShieldOutlinedIcon sx={{ color: "#CA8A04" }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#854D0E", mt: 1 }}>
              {mediumCount}
            </Typography>
            <Typography variant="caption" sx={{ color: "#713F12" }}>
              Mild confusion or repeated questions noted
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ border: "1px solid #BBF7D0", backgroundColor: "#F0FDF4", borderRadius: 2.5 }}>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#166534" }}>
                LOW / BASELINE VERIFIED
              </Typography>
              <CheckCircleOutlinedIcon sx={{ color: "#16A34A" }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#166534", mt: 1 }}>
              {lowCount}
            </Typography>
            <Typography variant="caption" sx={{ color: "#14532D" }}>
              Normal conversational interaction telemetry
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Safety Table & Filter */}
      <Card sx={{ border: "1px solid #E2E8F0", borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5, flexWrap: "wrap", gap: 1.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A" }}>
              Recorded Safety Events
            </Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              {["ALL", "HIGH", "MEDIUM", "LOW"].map((risk) => (
                <Button
                  key={risk}
                  size="small"
                  variant={filterRisk === risk ? "contained" : "outlined"}
                  onClick={() => setFilterRisk(risk)}
                  sx={{
                    borderRadius: 2,
                    fontSize: "0.8rem",
                    fontWeight: 650,
                    borderColor: "#CBD5E1",
                    color: filterRisk === risk ? "#FFFFFF" : "#475569",
                    backgroundColor: filterRisk === risk ? "#1E293B" : "transparent",
                    "&:hover": {
                      backgroundColor: filterRisk === risk ? "#0F172A" : "#F1F5F9",
                    },
                  }}
                >
                  {risk}
                </Button>
              ))}
            </Box>
          </Box>

          {filteredEvents.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 6, textAlign: "center" }}>
              No safety events found for the selected risk filter.
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Severity</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Observed Observation</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Recommended Action</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: "#475569" }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEvents.map((e, index) => {
                    const isReviewed = (e.event_id && reviewedEvents.has(e.event_id)) || !e.human_review_required;
                    const isHigh = e.risk_level?.toUpperCase() === "HIGH";
                    const isMed = e.risk_level?.toUpperCase() === "MEDIUM";

                    return (
                      <TableRow key={e.event_id ?? index} hover>
                        <TableCell>
                          <Chip
                            label={e.risk_level?.toUpperCase() || "LOG"}
                            size="small"
                            color={isHigh ? "error" : isMed ? "warning" : "success"}
                            sx={{ fontWeight: 700, fontSize: "0.75rem" }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#1E293B" }}>
                          {e.reason}
                          {e.risk_signals && (
                            <Typography variant="caption" sx={{ display: "block", color: "#64748B", mt: 0.5 }}>
                              Signal: {e.risk_signals}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ color: "#475569" }}>
                          {e.recommended_next_step || "Maintain standard reassurance"}
                        </TableCell>
                        <TableCell>
                          {isReviewed ? (
                            <Chip label="Reviewed" size="small" variant="outlined" color="success" sx={{ fontSize: "0.72rem" }} />
                          ) : (
                            <Chip label="Review Pending" size="small" color="error" sx={{ fontSize: "0.72rem", fontWeight: 700 }} />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setSelectedEvent(e)}
                            sx={{ borderColor: "#CBD5E1", fontSize: "0.78rem" }}
                          >
                            Inspect
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Incident Detail Modal */}
      <Dialog open={Boolean(selectedEvent)} onClose={() => setSelectedEvent(null)} maxWidth="sm" fullWidth>
        {selectedEvent && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>
              Safety Observation Details
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">Risk Severity Level</Typography>
                  <Chip
                    label={selectedEvent.risk_level?.toUpperCase()}
                    color={
                      selectedEvent.risk_level?.toUpperCase() === "HIGH"
                        ? "error"
                        : selectedEvent.risk_level?.toUpperCase() === "MEDIUM"
                        ? "warning"
                        : "success"
                    }
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                </Box>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0F172A" }}>
                    Reason & Model Observation
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, color: "#334155" }}>
                    {selectedEvent.reason}
                  </Typography>
                </Box>
                {selectedEvent.risk_signals && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0F172A" }}>
                      Detected Risk Signals
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, color: "#334155" }}>
                      {selectedEvent.risk_signals}
                    </Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0F172A" }}>
                    Recommended Next Steps
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, color: "#334155" }}>
                    {selectedEvent.recommended_next_step || "Standard non-confrontational conversation"}
                  </Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                  <Typography variant="caption" sx={{ color: "#64748B" }}>
                    Safety Policy Guardian: Escalate if patient reports acute distress, disorientation about home safety, or misses essential medication windows.
                  </Typography>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setSelectedEvent(null)}>Close</Button>
              <Button
                variant="contained"
                onClick={handleReviewConfirm}
                sx={{ backgroundColor: "#1E3A8A" }}
              >
                Acknowledge & Mark Reviewed
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Stack>
  );
}
