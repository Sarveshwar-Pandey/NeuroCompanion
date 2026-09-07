import type { ReactNode } from "react";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import BrandMark from "../components/common/BrandMark";
import { useAppStore } from "../state/appStore";

interface CaregiverShellProps {
  children: ReactNode;
}

const navItems = [
  { to: "/caregiver", label: "Overview", icon: <DashboardOutlinedIcon /> },
  { to: "/caregiver/safety", label: "Safety & Alerts", icon: <ShieldOutlinedIcon /> },
  { to: "/caregiver/activity", label: "Cognitive Activity", icon: <InsightsOutlinedIcon /> },
  { to: "/caregiver/notifications", label: "Notifications & Tasks", icon: <NotificationsNoneIcon /> },
  { to: "/caregiver/how-it-works", label: "Neuro-SAN AI Trace", icon: <AccountTreeOutlinedIcon /> },
  { to: "/caregiver/trust", label: "Trust & Governance", icon: <VerifiedUserOutlinedIcon /> },
];

export default function CaregiverShell({ children }: CaregiverShellProps) {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  const setRole = useAppStore((state) => state.setRole);

  const handleSwitchToPatient = () => {
    setRole("patient");
    navigate("/");
  };

  const drawerContent = (
    <Box sx={{ width: 260, pt: 2.5, px: 2 }}>
      <Box sx={{ px: 1, mb: 3 }}>
        <BrandMark compact />
        <Typography
          variant="body2"
          sx={{
            mt: 0.75,
            color: "text.secondary",
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
        >
          Clinical & Caregiver Console
        </Typography>
      </Box>

      <List sx={{ px: 0 }}>
        {navItems.map((item) => {
          const isSelected =
            item.to === "/caregiver"
              ? location.pathname === "/caregiver"
              : location.pathname.startsWith(item.to);

          return (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              selected={isSelected}
              sx={{
                mb: 0.75,
                borderRadius: 2,
                py: 1.25,
                px: 1.75,
                "&.Mui-selected": {
                  backgroundColor: "rgba(30, 58, 138, 0.08)",
                  color: "primary.main",
                  fontWeight: 600,
                  "& .MuiListItemIcon-root": {
                    color: "primary.main",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 38, color: isSelected ? "primary.main" : "text.secondary" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: "0.92rem", fontWeight: isSelected ? 650 : 500 }}>
                    {item.label}
                  </Typography>
                }
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", backgroundColor: "#F8FAFC" }}>
      {!compact && (
        <Drawer
          variant="permanent"
          slotProps={{
            paper: {
              sx: {
                width: 260,
                borderRight: "1px solid #E2E8F0",
                backgroundColor: "#FFFFFF",
              },
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box sx={{ flex: 1, ml: compact ? 0 : "260px", minWidth: 0 }}>
        {/* Caregiver Top Navigation Bar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #E2E8F0",
            color: "text.primary",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.15rem", color: "#0F172A" }}>
                  Sukhvinder Sahu
                </Typography>
                <Chip
                  label="Active Patient"
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ height: 22, fontSize: "0.72rem", fontWeight: 700 }}
                />
              </Box>
              <Typography variant="caption" sx={{ color: "#64748B" }}>
                Neuro-SAN Multi-Agent Assisted Care · Case #NC-8921
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Chip
                label="Authorized Caregiver"
                size="small"
                sx={{
                  backgroundColor: "#F1F5F9",
                  color: "#334155",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  display: { xs: "none", sm: "inline-flex" },
                }}
              />
              <Button
                variant="outlined"
                startIcon={<PersonOutlinedIcon />}
                onClick={handleSwitchToPatient}
                size="small"
                sx={{
                  borderColor: "#CBD5E1",
                  color: "#1E293B",
                  fontWeight: 650,
                  "&:hover": { borderColor: "#94A3B8", backgroundColor: "#F8FAFC" },
                }}
              >
                Switch to Patient View
              </Button>
            </Box>
          </Toolbar>

          {compact && (
            <Box
              sx={{
                display: "flex",
                overflowX: "auto",
                px: 1.5,
                py: 1,
                borderTop: "1px solid #E2E8F0",
                gap: 1,
                backgroundColor: "#FFFFFF",
              }}
            >
              {navItems.map((item) => {
                const isSelected =
                  item.to === "/caregiver"
                    ? location.pathname === "/caregiver"
                    : location.pathname.startsWith(item.to);

                return (
                  <Button
                    key={item.to}
                    onClick={() => navigate(item.to)}
                    variant={isSelected ? "contained" : "text"}
                    size="small"
                    sx={{
                      whiteSpace: "nowrap",
                      borderRadius: 1.5,
                      fontSize: "0.82rem",
                      minHeight: 32,
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}
        </AppBar>

        {/* Content Viewport */}
        <Box component="main" sx={{ p: { xs: 2.5, md: 4 }, maxWidth: 1300, mx: "auto" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
