import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";

import PatientShell from "./shells/PatientShell";
import CaregiverShell from "./shells/CaregiverShell";

import PatientHomePage from "./pages/patient/HomePage";
import CompanionPage from "./pages/patient/CompanionPage";
import ActivitiesPage from "./pages/patient/ActivitiesPage";
import MemoriesPage from "./pages/patient/MemoriesPage";
import HelpPage from "./pages/patient/HelpPage";

import CaregiverOverviewPage from "./pages/caregiver/CaregiverOverviewPage";
import CaregiverSafetyPage from "./pages/caregiver/CaregiverSafetyPage";
import CaregiverActivityPage from "./pages/caregiver/CaregiverActivityPage";
import CaregiverNotificationsPage from "./pages/caregiver/CaregiverNotificationsPage";
import CaregiverArchitecturePage from "./pages/caregiver/CaregiverArchitecturePage";
import CaregiverTrustPage from "./pages/caregiver/CaregiverTrustPage";

import { patientTheme } from "./theme/patientTheme";
import { caregiverTheme } from "./theme/caregiverTheme";

function DynamicThemedRoutes() {
  const location = useLocation();
  const isCaregiver = location.pathname.startsWith("/caregiver");
  const activeTheme = isCaregiver ? caregiverTheme : patientTheme;

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <Routes>
        {/* Patient Experience Routes */}
        <Route
          path="/"
          element={
            <PatientShell>
              <PatientHomePage />
            </PatientShell>
          }
        />
        <Route
          path="/companion"
          element={
            <PatientShell>
              <CompanionPage />
            </PatientShell>
          }
        />
        <Route
          path="/activities"
          element={
            <PatientShell>
              <ActivitiesPage />
            </PatientShell>
          }
        />
        <Route
          path="/memories"
          element={
            <PatientShell>
              <MemoriesPage />
            </PatientShell>
          }
        />
        <Route
          path="/help"
          element={
            <PatientShell>
              <HelpPage />
            </PatientShell>
          }
        />

        {/* Caregiver Portal Routes */}
        <Route
          path="/caregiver"
          element={
            <CaregiverShell>
              <CaregiverOverviewPage />
            </CaregiverShell>
          }
        />
        <Route
          path="/caregiver/safety"
          element={
            <CaregiverShell>
              <CaregiverSafetyPage />
            </CaregiverShell>
          }
        />
        <Route
          path="/caregiver/activity"
          element={
            <CaregiverShell>
              <CaregiverActivityPage />
            </CaregiverShell>
          }
        />
        <Route
          path="/caregiver/notifications"
          element={
            <CaregiverShell>
              <CaregiverNotificationsPage />
            </CaregiverShell>
          }
        />
        <Route
          path="/caregiver/how-it-works"
          element={
            <CaregiverShell>
              <CaregiverArchitecturePage />
            </CaregiverShell>
          }
        />
        <Route
          path="/caregiver/trust"
          element={
            <CaregiverShell>
              <CaregiverTrustPage />
            </CaregiverShell>
          }
        />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DynamicThemedRoutes />
    </BrowserRouter>
  );
}