import { Chip } from "@mui/material";

type Tone = "neutral" | "success" | "warning" | "critical" | "info";

interface StatusChipProps {
  label: string;
  tone?: Tone;
}

const tones: Record<Tone, { bg: string; fg: string }> = {
  neutral: { bg: "#E8EEF4", fg: "#334155" },
  success: { bg: "#D9EFE6", fg: "#0F766E" },
  warning: { bg: "#F8E6C8", fg: "#9A5B12" },
  critical: { bg: "#F8D7D4", fg: "#9F1D1D" },
  info: { bg: "#DCE7F8", fg: "#1E3A5F" },
};

export default function StatusChip({
  label,
  tone = "neutral",
}: StatusChipProps) {
  const colors = tones[tone];

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        backgroundColor: colors.bg,
        color: colors.fg,
        fontWeight: 650,
      }}
    />
  );
}
