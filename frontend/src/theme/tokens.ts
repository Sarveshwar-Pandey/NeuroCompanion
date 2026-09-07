export const radii = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
} as const;

export const shadows = {
  patient:
    "0 10px 30px rgba(61, 90, 74, 0.08), 0 2px 8px rgba(61, 90, 74, 0.04)",
  caregiver: "0 1px 2px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.04)",
} as const;

export const motion = {
  gentle: "180ms ease",
} as const;

export const patientColors = {
  ivory: "#F4EFE6",
  cream: "#FFF9F1",
  paper: "#FFFcf7",
  sage: "#3F6F66",
  sageDeep: "#2F5650",
  mist: "#D7E4DF",
  sky: "#6E8CA3",
  ink: "#24302C",
  muted: "#5C6B66",
  success: "#3F6B4A",
  warning: "#B5812F",
  critical: "#A33B32",
} as const;

export const caregiverColors = {
  canvas: "#F3F5F8",
  paper: "#FFFFFF",
  navy: "#1E3A5F",
  navyDeep: "#152A46",
  slate: "#475569",
  ink: "#0F172A",
  muted: "#64748B",
  line: "#E2E8F0",
  success: "#0F766E",
  warning: "#B45309",
  critical: "#B91C1C",
  info: "#1D4ED8",
} as const;
