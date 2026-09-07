import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function HelpPage() {
  const navigate = useNavigate();

  return (
    <Stack spacing={3}>
      <Typography variant="h1">Help</Typography>
      <Typography sx={{ fontSize: "1.2rem" }}>
        I'm here with you. You can take your time.
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h3">If you feel unsure</Typography>
          <Typography sx={{ mt: 1 }}>
            Talk to NeuroCompanion, or ask a person you trust for help.
          </Typography>
          <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate("/companion")}>
            Talk to NeuroCompanion
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h3">What this companion can do</Typography>
          <Stack spacing={1} sx={{ mt: 1.5 }}>
            <Typography>Help you remember people you know.</Typography>
            <Typography>Tell you what is planned today.</Typography>
            <Typography>Do a short activity with you.</Typography>
            <Typography>Help you get a person involved if something feels wrong.</Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h3">Trust</Typography>
          <Typography sx={{ mt: 1 }}>
            Your personal information is kept separate from everyday conversation context.
            Safety decisions use a policy layer and human review. This is a demonstration
            companion, not a medical service.
          </Typography>
        </CardContent>
      </Card>

      <Button variant="text" onClick={() => navigate("/demo")} sx={{ alignSelf: "flex-start" }}>
        Open demo views
      </Button>
    </Stack>
  );
}
