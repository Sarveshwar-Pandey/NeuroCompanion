import { createTheme } from "@mui/material/styles";

import { caregiverColors, radii, shadows } from "./tokens";

export const caregiverTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: caregiverColors.navy,
      dark: caregiverColors.navyDeep,
      contrastText: "#ffffff",
    },
    secondary: {
      main: caregiverColors.slate,
    },
    background: {
      default: caregiverColors.canvas,
      paper: caregiverColors.paper,
    },
    text: {
      primary: caregiverColors.ink,
      secondary: caregiverColors.muted,
    },
    success: { main: caregiverColors.success },
    warning: { main: caregiverColors.warning },
    error: { main: caregiverColors.critical },
    info: { main: caregiverColors.info },
    divider: caregiverColors.line,
  },
  typography: {
    fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"IBM Plex Serif", Georgia, serif',
      fontWeight: 600,
      fontSize: "1.85rem",
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: '"IBM Plex Serif", Georgia, serif',
      fontWeight: 600,
      fontSize: "1.4rem",
    },
    h3: {
      fontWeight: 650,
      fontSize: "1.1rem",
    },
    h4: {
      fontWeight: 650,
      fontSize: "1.05rem",
    },
    body1: {
      fontSize: "0.95rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.85rem",
      lineHeight: 1.45,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      fontSize: "0.9rem",
    },
  },
  shape: {
    borderRadius: radii.sm,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: caregiverColors.canvas,
        },
      },
    },
    MuiButton: {
      defaultProps: { size: "medium" },
      styleOverrides: {
        root: {
          minHeight: 40,
          borderRadius: radii.sm,
        },
        contained: { boxShadow: "none" },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: radii.md,
          boxShadow: shadows.caregiver,
          border: `1px solid ${caregiverColors.line}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});
