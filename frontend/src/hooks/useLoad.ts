import { useCallback, useEffect, useState } from "react";

interface LoadState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useLoad<T>(
  loader: () => Promise<T>,
  friendlyError: string,
): LoadState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    void loader()
      .then((result) => {
        if (!cancelled) {
          setData(result);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : friendlyError);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [loader, friendlyError]);

  useEffect(() => {
    const cancel = reload();
    return cancel;
  }, [reload]);

  return { data, loading, error, reload };
}
