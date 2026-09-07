import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { sendChatMessage } from "../api/chat";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function CompanionPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] =
    useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] =
    useState<string | null>(null);

  async function handleSend() {
    const trimmed = message.trim();

    if (!trimmed || loading) {
      return;
    }

    setError(null);

    setMessages((current) => [
      ...current,
      {
        role: "user",
        text: trimmed,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const result = await sendChatMessage(trimmed);

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: result.response,
        },
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "The companion is unavailable.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">
          NeuroCompanion
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          How can I help you today?
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            {messages.length === 0 && (
              <Typography color="text.secondary">
                You can ask things like:
                “Who is Harpreet?” or
                “Who is my wife?”
              </Typography>
            )}

            {messages.map((item, index) => (
              <Box
                key={`${item.role}-${index}`}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor:
                    item.role === "user"
                      ? "#eef3ff"
                      : "#f3f5f4",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {item.role === "user"
                    ? "You"
                    : "NeuroCompanion"}
                </Typography>

                <Typography sx={{ mt: 0.5 }}>
                  {item.text}
                </Typography>
              </Box>
            ))}

            {loading && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CircularProgress size={20} />
                <Typography color="text.secondary">
                  Thinking...
                </Typography>
              </Box>
            )}

            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Ask NeuroCompanion"
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();
                  void handleSend();
                }
              }}
              multiline
              minRows={2}
            />

            <Button
              variant="contained"
              onClick={() => void handleSend()}
              disabled={loading || !message.trim()}
            >
              Send
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}