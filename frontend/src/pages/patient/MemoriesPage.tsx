import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { getPatientMemories, getPatientPeople } from "../../api/patient";
import { EmptyState, ErrorState, LoadingState } from "../../components/common/Feedback";
import { useLoad } from "../../hooks/useLoad";
import type {
  PatientMemoriesResponse,
  PatientPeopleResponse,
  PersonalMemory,
} from "../../types/api";

interface MemoryBundle {
  people: PatientPeopleResponse;
  memories: PatientMemoriesResponse;
}

function loadMemories(): Promise<MemoryBundle> {
  return Promise.all([getPatientPeople(), getPatientMemories()]).then(
    ([people, memories]) => ({ people, memories }),
  );
}

const sections: Array<{ key: string; title: string }> = [
  { key: "places", title: "Important places" },
  { key: "events", title: "Important events" },
  { key: "recent", title: "Recent memories" },
  { key: "help", title: "Things that help me" },
  { key: "facts", title: "Things I know about myself" },
];

function MemoryGrid({ items }: { items: PersonalMemory[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No saved memories yet."
        body="Your companion can help you remember when you're ready."
      />
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        gap: 1.5,
      }}
    >
      {items.map((item) => (
        <Card key={item.memory_id}>
          <CardContent>
            <Typography>{item.content}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {item.certainty}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default function MemoriesPage() {
  const navigate = useNavigate();
  const { data, loading, error, reload } = useLoad(
    loadMemories,
    "Something went wrong. Let's try again.",
  );

  if (loading) {
    return <LoadingState label="Just a moment..." />;
  }

  if (error || !data) {
    return (
      <ErrorState
        message={error ?? "Something went wrong. Let's try again."}
        onRetry={reload}
      />
    );
  }

  return (
    <Stack spacing={3.5}>
      <Box>
        <Typography variant="h1">My memories</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          You don't have to remember everything. These are here when you need them.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h2" sx={{ mb: 1.5 }}>
          People I know
        </Typography>
        {data.people.people.length === 0 ? (
          <EmptyState
            title="No saved memories yet."
            body="Family and friends will appear here when they are saved."
          />
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 1.5,
            }}
          >
            {data.people.people.map((person) => (
              <Card key={person.person_id}>
                <CardContent>
                  <Typography variant="h3">{person.name}</Typography>
                  <Typography color="text.secondary">
                    {person.relationship ?? "Someone important to you"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {person.certainty}
                  </Typography>
                  <Button
                    sx={{ mt: 1.5, minHeight: 44 }}
                    onClick={() =>
                      navigate("/companion", {
                        state: { prompt: `Who is ${person.name}?` },
                      })
                    }
                  >
                    Ask NeuroCompanion
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {sections.map((section) => (
        <Box key={section.key}>
          <Typography variant="h2" sx={{ mb: 1.5 }}>
            {section.title}
          </Typography>
          <MemoryGrid
            items={data.memories.memories.filter(
              (item) => item.section === section.key,
            )}
          />
        </Box>
      ))}
    </Stack>
  );
}
