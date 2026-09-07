import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  getActivityHistory,
  getActivityLibrary,
  logActivityPerformance,
} from "../../api/activities";
import { ErrorState, EmptyState, LoadingState } from "../../components/common/Feedback";
import { useLoad } from "../../hooks/useLoad";
import { formatTime } from "../../lib/format";
import type {
  ActivityDefinition,
  ActivityHistoryResponse,
  ActivityLibraryResponse,
} from "../../types/api";

interface ActivitiesBundle {
  library: ActivityLibraryResponse;
  history: ActivityHistoryResponse;
}

function loadActivities(): Promise<ActivitiesBundle> {
  return Promise.all([getActivityLibrary(), getActivityHistory()]).then(
    ([library, history]) => ({ library, history }),
  );
}

export default function ActivitiesPage() {
  const { data, loading, error, reload } = useLoad(
    loadActivities,
    "Something went wrong. Let's try again.",
  );
  const [active, setActive] = useState<ActivityDefinition | null>(null);
  const [answer, setAnswer] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (loading) {
    return <LoadingState label="Getting today's activity ready..." />;
  }

  if (error || !data) {
    return (
      <ErrorState
        message={error ?? "Something went wrong. Let's try again."}
        onRetry={reload}
      />
    );
  }

  async function complete() {
    if (!active || !startedAt) {
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      await logActivityPerformance({
        activity_id: active.id,
        notes: answer.trim() || undefined,
        duration_seconds: Math.max(
          1,
          Math.round((Date.now() - startedAt) / 1000),
        ),
        outcome: "completed",
      });
      setDone(true);
      reload();
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Let's try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (active && !done) {
    return (
      <Stack spacing={3} sx={{ maxWidth: 640 }}>
        <Typography variant="h1">{active.title}</Typography>
        <Typography color="text.secondary">
          One thing at a time. You can take your time.
        </Typography>
        <Card>
          <CardContent>
            <Typography sx={{ fontSize: "1.2rem" }}>
              {active.instructions}
            </Typography>
          </CardContent>
        </Card>
        <TextField
          multiline
          minRows={4}
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="You can say it in your own words."
        />
        {saveError && (
          <ErrorState message={saveError} onRetry={() => void complete()} />
        )}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button
            variant="contained"
            onClick={() => void complete()}
            disabled={saving}
          >
            I'm finished
          </Button>
          <Button
            variant="text"
            onClick={() => {
              setActive(null);
              setAnswer("");
              setStartedAt(null);
            }}
          >
            Back
          </Button>
        </Stack>
      </Stack>
    );
  }

  if (done && active) {
    return (
      <Stack spacing={3} sx={{ maxWidth: 640 }}>
        <Typography variant="h1">Nice work.</Typography>
        <Typography sx={{ fontSize: "1.2rem" }}>
          You finished {active.title}. Let's try another one whenever you're ready.
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setActive(null);
            setDone(false);
            setAnswer("");
            setStartedAt(null);
          }}
        >
          Back to activities
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h1">Today's activity</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Would you like to do a short activity?
        </Typography>
      </Box>

      <Stack spacing={2}>
        {data.library.activities.map((activity) => (
          <Card key={activity.id}>
            <CardContent>
              <Typography variant="h3">{activity.title}</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                About {activity.expected_duration} minutes
              </Typography>
              <Typography sx={{ mt: 1.5 }}>{activity.instructions}</Typography>
              <Button
                sx={{ mt: 2 }}
                variant="contained"
                onClick={() => {
                  setActive(activity);
                  setStartedAt(Date.now());
                  setDone(false);
                  setAnswer("");
                }}
              >
                Start
              </Button>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Card>
        <CardContent>
          <Typography variant="h3">Recently completed</Typography>
          {data.history.history.length === 0 ? (
            <EmptyState
              title="No activities have been recorded yet."
              body="When you finish one, it will show up here."
            />
          ) : (
            <Stack spacing={1.25} sx={{ mt: 2 }}>
              {data.history.history.map((item, index) => (
                <Box key={`${item.activity_id}-${item.completed_at}-${index}`}>
                  <Typography sx={{ fontWeight: 650 }}>
                    {item.activity_id}
                  </Typography>
                  <Typography color="text.secondary">
                    {item.outcome ?? "completed"} · {formatTime(item.completed_at)}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
