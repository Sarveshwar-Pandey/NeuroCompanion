import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import EventRepeatOutlinedIcon from "@mui/icons-material/EventRepeatOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface AgentDef {
  id: string;
  name: string;
  role: string;
  icon: any;
  color: string;
  bgColor: string;
  tools: string[];
  description: string;
}

const agents: AgentDef[] = [
  {
    id: "companion",
    name: "Companion Agent",
    role: "Conversational Anchor",
    icon: ChatOutlinedIcon,
    color: "#059669",
    bgColor: "#ECFDF5",
    tools: ["tone_modulation", "speech_synthesis_hooks"],
    description: "Maintains comforting, warm, non-judgmental dialogue. Never uses medical jargon or contradicts the patient.",
  },
  {
    id: "routine",
    name: "Routine & Schedule Agent",
    role: "Temporal Orientation",
    icon: EventRepeatOutlinedIcon,
    color: "#2563EB",
    bgColor: "#EFF6FF",
    tools: ["routine_get_day", "routine_mark_complete", "routine_remind"],
    description: "Tracks daily meal, medication, and rest milestones. Informs patient of today's plan without creating time anxiety.",
  },
  {
    id: "memory",
    name: "Biographical Memory Agent",
    role: "Reminiscence Support",
    icon: FavoriteBorderOutlinedIcon,
    color: "#D97706",
    bgColor: "#FFFBEB",
    tools: ["memory_get_person", "memory_list_events", "memory_recall_place"],
    description: "Retrieves familiar family members, photos, and cherished places from private memory storage to ground the patient.",
  },
  {
    id: "cognitive",
    name: "Cognitive Exercise Agent",
    role: "Mental Engagement",
    icon: PsychologyOutlinedIcon,
    color: "#7C3AED",
    bgColor: "#F5F3FF",
    tools: ["activity_get_library", "activity_log_score"],
    description: "Coordinates light cognitive stimulation like word associations and trivia with infinite patience and encouragement.",
  },
  {
    id: "safety",
    name: "Safety & Guardrails Monitor",
    role: "Continuous Risk Watch",
    icon: ShieldOutlinedIcon,
    color: "#DC2626",
    bgColor: "#FEF2F2",
    tools: ["safety_classify_risk", "safety_escalate_human", "safety_log_event"],
    description: "Evaluates every conversational turn for disorientation, wandering intent, pain, or missed meds. Triggers human-in-the-loop.",
  },
  {
    id: "caregiver",
    name: "Caregiver Summary Agent",
    role: "Clinical Telemetry & Digest",
    icon: SummarizeOutlinedIcon,
    color: "#0F172A",
    bgColor: "#F1F5F9",
    tools: ["caregiver_generate_digest", "notification_dispatch"],
    description: "Aggregates daily events, adherence metrics, and cognitive trends into an executive overview for authorized caregivers.",
  },
];

interface TraceScenario {
  title: string;
  userInput: string;
  steps: Array<{
    agent: string;
    action: string;
    detail: string;
    status: "pass" | "tool" | "guardrail";
  }>;
  finalResponse: string;
}

const scenarios: TraceScenario[] = [
  {
    title: "Scenario 1: Familiar Person Inquiry",
    userInput: "Who is Harpreet? Why isn't he home right now?",
    steps: [
      {
        agent: "Safety & Guardrails Monitor",
        action: "Pre-execution Guardrail Check",
        detail: "Classified risk: LOW (mild temporal confusion, zero acute panic or physical danger). Proceeding to Memory Agent.",
        status: "pass",
      },
      {
        agent: "Biographical Memory Agent",
        action: "Tool Call: memory_get_person('Harpreet')",
        detail: "Retrieved record: Harpreet Sahu (Son, Pulmonologist, lives 15 mins away). Key context: Visits every Tuesday evening.",
        status: "tool",
      },
      {
        agent: "Routine & Schedule Agent",
        action: "Tool Call: routine_get_day()",
        detail: "Confirmed today is Tuesday; Harpreet's visit is scheduled on calendar for 6:30 PM.",
        status: "tool",
      },
      {
        agent: "Companion Agent",
        action: "Response Synthesis",
        detail: "Composed empathetic, validating response without clinical correction: 'Harpreet is your wonderful son. He is at his clinic right now and will be visiting you at 6:30 this evening.'",
        status: "pass",
      },
      {
        agent: "Caregiver Summary Agent",
        action: "Telemetry Logging",
        detail: "Logged memory query event to Caregiver Audit Trail (Type: Family Recall).",
        status: "guardrail",
      },
    ],
    finalResponse: "Harpreet is your son. He is working at his clinic right now, and he will be here to have tea with you this evening around 6:30.",
  },
  {
    title: "Scenario 2: Medication Concern & Mild Agitation",
    userInput: "I think someone took my blood pressure pills! I can't find them!",
    steps: [
      {
        agent: "Safety & Guardrails Monitor",
        action: "Pre-execution Risk Evaluation",
        detail: "Classified risk: MEDIUM (medication anxiety, potential missed dose). Flagged for human review.",
        status: "guardrail",
      },
      {
        agent: "Routine & Schedule Agent",
        action: "Tool Call: routine_check_status('Blood Pressure Med')",
        detail: "Verified: Morning dose of Amlodipine was logged as taken at 8:15 AM by caregiver nurse.",
        status: "tool",
      },
      {
        agent: "Companion Agent",
        action: "De-escalating Reassurance",
        detail: "Avoided confrontational disagreement. Affirmed safety: 'Your morning blood pressure medicine was already taken with breakfast at 8:15 AM.'",
        status: "pass",
      },
      {
        agent: "Caregiver Summary Agent",
        action: "Notification Dispatch",
        detail: "Sent push notification to caregiver Dr. Harpreet: 'Patient expressed concern regarding morning medication. Dose verified taken.'",
        status: "tool",
      },
    ],
    finalResponse: "Everything is completely safe, Sukhvinder. You already had your morning blood pressure pill with your breakfast at 8:15 AM today. You don't need to take any more right now.",
  },
];

export default function CaregiverArchitecturePage() {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const activeScenario = scenarios[selectedScenarioIndex];

  return (
    <Stack spacing={4}>
      {/* Header */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
          Neuro-SAN Multi-Agent Architecture & Execution Trace
        </Typography>
        <Typography variant="body1" sx={{ color: "#64748B", mt: 0.5 }}>
          Inspect how 6 specialized micro-agents orchestrate via Neuro-SAN protocols to deliver safe, calibrated cognitive care.
        </Typography>
      </Box>

      {/* 6 Agents Architecture Grid */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A", mb: 2 }}>
          Specialized Agent Topology
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
            gap: 2.5,
          }}
        >
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <Card
                key={agent.id}
                sx={{
                  border: "1px solid #E2E8F0",
                  borderRadius: 2.5,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                  },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        backgroundColor: agent.bgColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: agent.color,
                      }}
                    >
                      <Icon fontSize="medium" />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 750, color: "#0F172A", fontSize: "1rem" }}>
                        {agent.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>
                        {agent.role}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ color: "#475569", minHeight: 60 }}>
                    {agent.description}
                  </Typography>

                  <Divider sx={{ my: 1.5 }} />

                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B", display: "block", mb: 0.75 }}>
                    Coded Tools / Capabilities:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                    {agent.tools.map((tool) => (
                      <Chip
                        key={tool}
                        label={tool}
                        size="small"
                        sx={{
                          fontSize: "0.68rem",
                          fontFamily: "monospace",
                          backgroundColor: "#F1F5F9",
                          color: "#334155",
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Box>

      {/* Interactive Execution Trace Simulator */}
      <Card sx={{ border: "1px solid #E2E8F0", borderRadius: 3 }}>
        <CardContent sx={{ p: 3.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <AccountTreeOutlinedIcon sx={{ color: "#2563EB", fontSize: 26 }} />
              <Typography variant="h6" sx={{ fontWeight: 750, color: "#0F172A" }}>
                Multi-Agent Execution Trace Inspector
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              {scenarios.map((sc, i) => (
                <Button
                  key={i}
                  size="small"
                  variant={selectedScenarioIndex === i ? "contained" : "outlined"}
                  onClick={() => setSelectedScenarioIndex(i)}
                  sx={{
                    borderRadius: 2,
                    fontSize: "0.82rem",
                    fontWeight: 650,
                    borderColor: "#CBD5E1",
                    backgroundColor: selectedScenarioIndex === i ? "#1E3A8A" : "transparent",
                  }}
                >
                  {sc.title}
                </Button>
              ))}
            </Box>
          </Box>

          {/* User Prompt Input Box */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "#F8FAFC",
              border: "1px solid #E2E8F0",
              mb: 3,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
              Patient Utterance
            </Typography>
            <Typography sx={{ fontWeight: 650, fontSize: "1.1rem", color: "#1E293B", mt: 0.5 }}>
              "{activeScenario.userInput}"
            </Typography>
          </Paper>

          {/* Execution Steps Timeline */}
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#475569", mb: 2 }}>
            ORCHESTRATION PIPELINE STEPS
          </Typography>

          <Stack spacing={2} sx={{ mb: 3 }}>
            {activeScenario.steps.map((step, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderLeft:
                    step.status === "guardrail"
                      ? "4px solid #DC2626"
                      : step.status === "tool"
                      ? "4px solid #2563EB"
                      : "4px solid #10B981",
                }}
              >
                <Box sx={{ minWidth: 28 }}>
                  <Chip
                    label={idx + 1}
                    size="small"
                    sx={{ width: 26, height: 26, fontWeight: 700, backgroundColor: "#F1F5F9" }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ fontWeight: 700, color: "#0F172A", fontSize: "0.95rem" }}>
                      {step.agent} — {step.action}
                    </Typography>
                    <Chip
                      label={step.status.toUpperCase()}
                      size="small"
                      sx={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        backgroundColor:
                          step.status === "guardrail"
                            ? "#FEF2F2"
                            : step.status === "tool"
                            ? "#EFF6FF"
                            : "#ECFDF5",
                        color:
                          step.status === "guardrail"
                            ? "#991B1B"
                            : step.status === "tool"
                            ? "#1E40AF"
                            : "#065F46",
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: "#475569", mt: 0.75, fontFamily: "inherit" }}>
                    {step.detail}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>

          {/* Final Calibrated Response */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2,
              backgroundColor: "rgba(16, 185, 129, 0.06)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <CheckCircleIcon sx={{ color: "#059669", fontSize: 20 }} />
              <Typography variant="caption" sx={{ fontWeight: 750, color: "#065F46", textTransform: "uppercase" }}>
                Final Synthesized Companion Output
              </Typography>
            </Box>
            <Typography sx={{ fontSize: "1.08rem", fontWeight: 600, color: "#064E3B", mt: 0.5 }}>
              "{activeScenario.finalResponse}"
            </Typography>
          </Paper>
        </CardContent>
      </Card>
    </Stack>
  );
}
