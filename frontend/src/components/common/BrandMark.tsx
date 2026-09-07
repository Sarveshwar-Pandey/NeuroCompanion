import { Box, Typography } from "@mui/material";

interface BrandMarkProps {
  compact?: boolean;
  inverted?: boolean;
}

export default function BrandMark({
  compact = false,
  inverted = false,
}: BrandMarkProps) {
  const color = inverted ? "#FFFFFF" : "currentColor";

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1.2,
        color,
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: compact ? 28 : 34,
          height: compact ? 28 : 34,
          borderRadius: "50%",
          background: inverted
            ? "linear-gradient(145deg, #9ec9c0, #3F6F66)"
            : "linear-gradient(145deg, #6FA39A, #3F6F66)",
          display: "grid",
          placeItems: "center",
          boxShadow: inverted ? "none" : "0 6px 16px rgba(63, 111, 102, 0.25)",
        }}
      >
        <Box
          sx={{
            width: compact ? 10 : 12,
            height: compact ? 10 : 12,
            borderRadius: "50%",
            backgroundColor: "#FFF9F1",
          }}
        />
      </Box>
      <Typography
        component="span"
        sx={{
          fontWeight: 700,
          letterSpacing: "-0.03em",
          fontSize: compact ? "1.05rem" : "1.2rem",
          fontFamily: "inherit",
        }}
      >
        NeuroCompanion
      </Typography>
    </Box>
  );
}
