import type { ReactNode } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ChatBubbleOutlinedIcon from "@mui/icons-material/ChatBubbleOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Button,
  Chip,
  Container,
  Fab,
  IconButton,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import BrandMark from "../components/common/BrandMark";
import { useAppStore } from "../state/appStore";

interface PatientShellProps {
  children: ReactNode;
}

const navItems = [
  { to: "/", label: "Home", icon: <HomeOutlinedIcon /> },
  { to: "/companion", label: "Companion", icon: <ChatBubbleOutlinedIcon /> },
  { to: "/activities", label: "Activities", icon: <SelfImprovementIcon /> },
  { to: "/memories", label: "Memories", icon: <FavoriteBorderIcon /> },
  { to: "/help", label: "Help", icon: <HelpOutlinedIcon /> },
];

export default function PatientShell({ children }: PatientShellProps) {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  const setRole = useAppStore((state) => state.setRole);

  const handleSwitchToCaregiver = () => {
    setRole("caregiver");
    navigate("/caregiver");
  };

  return (
    <Box sx={{ minHeight: "100vh", pb: compact ? 10 : 2 }}>
      {/* Patient Header */}
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          backdropFilter: "blur(16px)",
          backgroundColor: "rgba(244, 239, 230, 0.92)",
          borderBottom: "1px solid rgba(47, 86, 80, 0.12)",
        }}
      >
        <Container maxWidth="md" sx={{ py: 1.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <BrandMark />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                icon={<AdminPanelSettingsOutlinedIcon fontSize="small" />}
                label="Caregiver Portal"
                size="medium"
                clickable
                onClick={handleSwitchToCaregiver}
                sx={{
                  backgroundColor: "rgba(47, 86, 80, 0.08)",
                  color: "#2F5650",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  "&:hover": {
                    backgroundColor: "rgba(47, 86, 80, 0.16)",
                  },
                }}
              />
              <IconButton
                aria-label="Help & Assistance"
                onClick={() => navigate("/help")}
                sx={{ display: { md: "none" }, color: "#2F5650" }}
              >
                <HelpOutlinedIcon />
              </IconButton>
            </Box>
          </Box>

          {!compact && (
            <Box
              component="nav"
              aria-label="Patient Navigation"
              sx={{
                display: "flex",
                gap: 1.5,
                mt: 1.5,
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  startIcon={item.icon}
                  variant={location.pathname === item.to ? "contained" : "text"}
                  sx={{
                    minHeight: 46,
                    px: 2.5,
                    fontSize: "1.05rem",
                    borderRadius: 3,
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container
        maxWidth="md"
        component="main"
        sx={{ py: { xs: 3, md: 4 }, pb: { xs: 12, md: 8 } }}
      >
        {children}
      </Container>

      {/* Compact Mobile Bottom Navigation */}
      {compact && (
        <Paper
          elevation={6}
          sx={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 0,
            zIndex: 30,
            borderTop: "1px solid rgba(47, 86, 80, 0.12)",
            backgroundColor: "#FAF7F2",
          }}
        >
          <BottomNavigation
            showLabels
            value={location.pathname}
            onChange={(_event, value: string) => navigate(value)}
            sx={{
              "& .Mui-selected": {
                color: "#2F5650 !important",
              },
            }}
          >
            {navItems.map((item) => (
              <BottomNavigationAction
                key={item.to}
                value={item.to}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}

      {/* Floating Companion Bubble for Easy Access on non-compact screens */}
      {!compact && location.pathname !== "/companion" && (
        <Fab
          color="primary"
          variant="extended"
          aria-label="Talk to NeuroCompanion"
          onClick={() => navigate("/companion")}
          sx={{
            position: "fixed",
            right: 32,
            bottom: 32,
            px: 3,
            py: 1.5,
            fontSize: "1.05rem",
            boxShadow: "0 8px 24px rgba(47, 86, 80, 0.28)",
            zIndex: 40,
          }}
        >
          <ChatBubbleOutlinedIcon sx={{ mr: 1 }} />
          Talk with Companion
        </Fab>
      )}
    </Box>
  );
}
