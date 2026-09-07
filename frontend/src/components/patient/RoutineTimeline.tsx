import type { RoutineItem } from "../../types/api";
import { compareClock, currentClock, minutesToLabel } from "../../lib/format";
import { Box, Stack, Typography } from "@mui/material";

interface RoutineTimelineProps {
  items: RoutineItem[];
}

function statusFor(item: RoutineItem, now: string, nextId: number | null): "now" | "next" | "later" | "past" {
  if (item.id === nextId && compareClock(item.time, now) <= 0) {
    return "now";
  }

  if (item.id === nextId) {
    return "next";
  }

  if (compareClock(item.time, now) < 0) {
    return "past";
  }

  return "later";
}

export default function RoutineTimeline({ items }: RoutineTimelineProps) {
  const now = currentClock();
  const upcoming = items.find((item) => compareClock(item.time, now) >= 0);
  const current =
    [...items].reverse().find((item) => compareClock(item.time, now) <= 0) ??
    upcoming;
  const nextId = current?.id ?? null;

  return (
    <Stack spacing={1.25}>
      {items.map((item) => {
        const status = statusFor(item, now, nextId);
        const prominent = status === "now" || status === "next";

        return (
          <Box
            key={item.id}
            sx={{
              display: "grid",
              gridTemplateColumns: "72px 14px 1fr",
              gap: 1.5,
              alignItems: "center",
              px: 1.5,
              py: 1.4,
              borderRadius: 3,
              backgroundColor: prominent ? "rgba(63, 111, 102, 0.1)" : "transparent",
              opacity: status === "past" ? 0.62 : 1,
            }}
          >
            <Typography sx={{ fontWeight: 700 }}>{item.time}</Typography>
            <Box
              aria-hidden
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor:
                  status === "now"
                    ? "primary.main"
                    : status === "next"
                      ? "secondary.main"
                      : "divider",
              }}
            />
            <Box>
              <Typography sx={{ fontWeight: prominent ? 700 : 500 }}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {status === "now"
                  ? "Now"
                  : status === "next"
                    ? "Up next"
                    : status === "past"
                      ? "Earlier today"
                      : "Coming later"}
                {minutesToLabel(item.duration_minutes)
                  ? ` · ${minutesToLabel(item.duration_minutes)}`
                  : ""}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
}
