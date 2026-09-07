import {
  Box,
  Card,
  CardContent,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";

export default function CaregiverTrustPage() {
  return (
    <Stack spacing={4}>
      {/* Header */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
          Trust, Safety & Governance Architecture
        </Typography>
        <Typography variant="body1" sx={{ color: "#64748B", mt: 0.5 }}>
          Built with strict guardrails, zero hallucinated medical diagnoses, and full human-in-the-loop oversight.
        </Typography>
      </Box>

      {/* 4 Pillars of Responsible AI */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: 3,
        }}
      >
        <Card sx={{ border: "1px solid #E2E8F0", borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
              <LockOutlinedIcon sx={{ color: "#2563EB" }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A" }}>
                Context Boundary Isolation
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6 }}>
              Biographical memory facts, private routine schedules, and live speech tokens are strictly partitioned. 
              The conversational engine only receives the minimal context needed to answer each query safely, 
              preventing prompt leakage or cross-contamination.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ border: "1px solid #E2E8F0", borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
              <HealthAndSafetyOutlinedIcon sx={{ color: "#059669" }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A" }}>
                No Clinical Diagnosis Overreach
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6 }}>
              NeuroCompanion operates strictly as a supportive cognitive companion and routine tracker. 
              It never prescribes medications, never renders clinical diagnoses, and explicitly advises the patient 
              and caregiver to seek professional medical consultation when physical symptoms are described.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ border: "1px solid #E2E8F0", borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
              <GavelOutlinedIcon sx={{ color: "#DC2626" }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A" }}>
                Mandatory Human-in-the-Loop Escalation
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6 }}>
              If a safety event is classified with moderate or high risk (e.g. repeated confusion regarding home safety, 
              intense distress, or missed critical medications), the system immediately dispatches an alert to authorized 
              caregivers and flags the log for human acknowledgment.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ border: "1px solid #E2E8F0", borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
              <VerifiedUserOutlinedIcon sx={{ color: "#7C3AED" }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A" }}>
                Tamper-Resistant Audit Trail
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6 }}>
              All safety events, agent delegation steps, and cognitive activity scores are timestamped 
              and stored in the local SQLite telemetry store (`nss_local.db`). Caregivers and healthcare 
              proxies maintain a transparent, verifiable timeline of patient state transitions.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Compliance & Data Statement */}
      <Paper
        elevation={0}
        sx={{
          p: 3.5,
          borderRadius: 3,
          backgroundColor: "#F8FAFC",
          border: "1px solid #E2E8F0",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 750, color: "#0F172A" }}>
            Cognitive Care Ethical Guardrails Statement
          </Typography>
          <Chip label="HIPAA & GDPR Aligned Principles" size="small" color="success" variant="outlined" sx={{ fontWeight: 700 }} />
        </Box>
        <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.7 }}>
          NeuroCompanion is engineered specifically for individuals experiencing mild cognitive impairment (MCI) and early-stage dementia. 
          Its conversation design follows evidence-based non-pharmacological principles: validation therapy (affirming emotional states without confrontation), 
          spaced retrieval for familiar memory retention, and predictable daily rhythm stabilization. 
          Patient dignity, autonomy, and psychological comfort remain the paramount governing constraint of all automated decisions.
        </Typography>
      </Paper>
    </Stack>
  );
}
