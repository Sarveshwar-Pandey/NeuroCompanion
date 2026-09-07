import { Alert, Button, Skeleton, Stack, Typography } from "@mui/material";

interface LoadingStateProps {
  label: string;
  lines?: number;
}

export function LoadingState({ label, lines = 4 }: LoadingStateProps) {
  return (
    <Stack spacing={1.5} aria-live="polite" aria-busy="true">
      <Typography color="text.secondary">{label}</Typography>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="rounded"
          height={index === 0 ? 72 : 48}
        />
      ))}
    </Stack>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Alert
      severity="error"
      action={
        <Button color="inherit" onClick={onRetry}>
          Try again
        </Button>
      }
    >
      {message}
    </Alert>
  );
}

interface EmptyStateProps {
  title: string;
  body: string;
}

export function EmptyState({ title, body }: EmptyStateProps) {
  return (
    <Stack spacing={0.75} sx={{ py: 1 }}>
      <Typography sx={{ fontWeight: 650 }}>{title}</Typography>
      <Typography color="text.secondary">{body}</Typography>
    </Stack>
  );
}
