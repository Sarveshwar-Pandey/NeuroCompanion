import type { ReactNode } from "react";
import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({
  children,
}: AppShellProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f7f8fa",
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        color="inherit"
      >
        <Toolbar>
          <Typography
            variant="h6"
            color="text.primary"
            sx={{ fontWeight: 700 }}
          >
            NeuroCompanion
          </Typography>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="md"
        sx={{ py: 4 }}
      >
        {children}
      </Container>
    </Box>
  );
}