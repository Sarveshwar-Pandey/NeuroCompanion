import { createTheme } from "@mui/material/styles";

import { patientColors, radii, shadows } from "./tokens";

export const patientTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: patientColors.sage,
      dark: patientColors.sageDeep,
      contrastText: "#ffffff",
    },
    secondary: {
      main: patientColors.sky,
    },
    background: {
      default: patientColors.ivory,
      paper: patientColors.paper,
    },
    text: {
      primary: patientColors.ink,
      secondary: patientColors.muted,
    },
    success: { main: patientColors.success },
    warning: { main: patientColors.warning },
    error: { main: patientColors.critical },
    divider: "rgba(47, 86, 80, 0.12)",
  },
  typography: {
    fontFamily: '"Figtree", "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 600,
      fontSize: "2.4rem",
      letterSpacing: "-0.03em",
      lineHeight: 1.15,
    },
    h2: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 600,
      fontSize: "1.9rem",
      letterSpacing: "-0.02em",
    },
    h3: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 600,
      fontSize: "1.45rem",
    },
    h4: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 600,
      fontSize: "1.3rem",
    },
    h5: {
      fontWeight: 650,
      fontSize: "1.15rem",
    },
    body1: {
      fontSize: "1.125rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "1rem",
      lineHeight: 1.55,
    },
    button: {
      textTransform: "none",
      fontWeight: 650,
      fontSize: "1.05rem",
    },
  },
  shape: {
    borderRadius: radii.md,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "radial-gradient(1200px 600px at 10% -10%, #e7efe9 0%, transparent 55%), radial-gradient(900px 500px at 110% 0%, #efe4d4 0%, transparent 50%), #F4EFE6",
        },
      },
    },
    MuiButton: {
      defaultProps: { size: "large" },
      styleOverrides: {
        root: {
          minHeight: 52,
          borderRadius: radii.lg,
          paddingInline: 22,
        },
        contained: {
          boxShadow: "none",
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: radii.lg,
          boxShadow: shadows.patient,
          border: "1px solid rgba(47, 86, 80, 0.08)",
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': {
            outline: "3px solid #3F6F66",
            outlineOffset: 3,
          },
        },
      },
    },
  },
});
