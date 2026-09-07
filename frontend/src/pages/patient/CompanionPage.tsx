import { useMemo, useRef, useState, useEffect } from "react";
import MicNoneIcon from "@mui/icons-material/MicNone";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";

import { sendChatMessage } from "../../api/chat";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const prompts = [
  "Who is Harpreet?",
  "What is my plan for today?",
  "Tell me a calm and happy memory.",
  "Let's do a 5-minute brain exercise.",
];

type VoiceState = "idle" | "listening" | "processing" | "speaking";

function getRecognition(): any {
  if (typeof window === "undefined") return null;
  const SpeechApi =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition ||
    null;
  if (!SpeechApi) return null;
  return new SpeechApi();
}

export default function CompanionPage() {
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello Sukhvinder! I am your NeuroCompanion. How are you feeling right now? We can check your day, talk about family, or just chat.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [voiceAvailable] = useState(() => Boolean(getRecognition()));
  const recognitionRef = useRef<any>(null);
  const prompt = (location.state as { prompt?: string } | null)?.prompt;

  useEffect(() => {
    if (prompt) {
      void send(prompt);
    }
  }, [prompt]);

  const statusLabel = useMemo(() => {
    if (voiceState === "listening") {
      return "Listening to you with care...";
    }
    if (voiceState === "processing" || loading) {
      return "Thinking gently...";
    }
    if (voiceState === "speaking") {
      return "Speaking aloud...";
    }
    return "I'm here with you.";
  }, [loading, voiceState]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) {
      return;
    }

    setError(null);
    setMessages((current) => [...current, { role: "user", text: trimmed }]);
    setMessage("");
    setLoading(true);
    setVoiceState("processing");

    try {
      const result = await sendChatMessage(trimmed);
      setMessages((current) => [
        ...current,
        { role: "assistant", text: result.response },
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "I had a moment of trouble hearing that. Let's try again.",
      );
    } finally {
      setLoading(false);
      setVoiceState("idle");
    }
  }

  function speak(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.onstart = () => setVoiceState("speaking");
    utterance.onend = () => setVoiceState("idle");
    utterance.onerror = () => setVoiceState("idle");
    window.speechSynthesis.speak(utterance);
  }

  function toggleListening() {
    if (voiceState === "listening") {
      recognitionRef.current?.stop();
      setVoiceState("idle");
      return;
    }

    const recognition = getRecognition();
    if (!recognition) {
      setError("Voice input isn't supported in this browser. You can type anytime.");
      return;
    }

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const heard = event.results?.[0]?.[0]?.transcript ?? "";
      if (heard) {
        setMessage(heard);
        setVoiceState("idle");
        void send(heard);
      }
    };
    recognition.onerror = () => {
      setVoiceState("idle");
      setError("I didn't quite catch that. You can type right below.");
    };
    recognition.onend = () => {
      setVoiceState((prev) => (prev === "listening" ? "idle" : prev));
    };

    recognitionRef.current = recognition;
    recognition.start();
    setVoiceState("listening");
  }

  const lastAssistant = [...messages].reverse().find((item) => item.role === "assistant");

  return (
    <Stack spacing={3} sx={{ minHeight: { md: "72vh" } }}>
      <Box>
        <Typography variant="h1">NeuroCompanion</Typography>
        <Typography sx={{ mt: 1, fontSize: "1.25rem", color: "primary.main", fontWeight: 600 }}>
          {statusLabel}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          There is never any rush. Take all the time you need.
        </Typography>
      </Box>

      {/* Chat Transcript Area */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "background.paper",
          borderRadius: 4,
          p: { xs: 2.5, md: 3.5 },
          minHeight: 320,
          maxHeight: 520,
          overflowY: "auto",
          boxShadow: "0 8px 30px rgba(47, 86, 80, 0.08)",
          border: "1px solid rgba(47, 86, 80, 0.1)",
        }}
      >
        <Stack spacing={2}>
          {messages.map((item, index) => (
            <Box
              key={`${item.role}-${index}`}
              sx={{
                alignSelf: item.role === "user" ? "flex-end" : "flex-start",
                maxWidth: { xs: "90%", md: "82%" },
                px: 2.5,
                py: 2,
                borderRadius: item.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                backgroundColor:
                  item.role === "user" ? "rgba(63,111,102,0.14)" : "#F4EFE6",
                border: item.role === "user" ? "1px solid rgba(63,111,102,0.2)" : "1px solid rgba(47,86,80,0.06)",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 700, color: item.role === "user" ? "primary.dark" : "text.secondary" }}>
                {item.role === "user" ? "You" : "NeuroCompanion"}
              </Typography>
              <Typography sx={{ mt: 0.75, fontSize: "1.15rem", lineHeight: 1.6 }}>
                {item.text}
              </Typography>
            </Box>
          ))}

          {loading && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
              <CircularProgress size={20} sx={{ color: "primary.main" }} />
              <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
                Composing a thoughtful answer...
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>

      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => setError(null)}>
              Dismiss
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Suggested Quick Prompt Pills */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.25 }}>
        {prompts.map((p) => (
          <Chip
            key={p}
            label={p}
            onClick={() => void send(p)}
            disabled={loading}
            sx={{
              fontSize: "0.95rem",
              py: 2.5,
              px: 1.5,
              borderRadius: 3,
              backgroundColor: "rgba(47, 86, 80, 0.08)",
              "&:hover": { backgroundColor: "rgba(47, 86, 80, 0.16)" },
            }}
          />
        ))}
      </Box>

      {/* Input controls */}
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
        <IconButton
          aria-label={voiceState === "listening" ? "Stop listening" : "Speak voice message"}
          onClick={toggleListening}
          disabled={!voiceAvailable || loading}
          color={voiceState === "listening" ? "error" : "primary"}
          sx={{
            width: 56,
            height: 56,
            borderRadius: 3,
            border: "1px solid",
            borderColor: voiceState === "listening" ? "error.main" : "divider",
            backgroundColor: voiceState === "listening" ? "rgba(163,59,50,0.12)" : "background.paper",
            boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
          }}
        >
          {voiceState === "listening" ? <StopCircleOutlinedIcon fontSize="large" /> : <MicNoneIcon fontSize="large" />}
        </IconButton>

        <TextField
          fullWidth
          placeholder="Ask me anything, Sukhvinder..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void send(message);
            }
          }}
          multiline
          minRows={1}
          maxRows={3}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor: "background.paper",
              fontSize: "1.1rem",
            },
          }}
        />

        <Button
          variant="contained"
          onClick={() => void send(message)}
          disabled={loading || !message.trim()}
          sx={{ minWidth: 100, minHeight: 54, borderRadius: 3, fontSize: "1.05rem" }}
        >
          Send
        </Button>
      </Box>

      {lastAssistant && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="text"
            startIcon={<VolumeUpOutlinedIcon />}
            onClick={() => speak(lastAssistant.text)}
            sx={{ minHeight: 44, color: "primary.main" }}
          >
            Listen to NeuroCompanion's last response
          </Button>
        </Box>
      )}
    </Stack>
  );
}
