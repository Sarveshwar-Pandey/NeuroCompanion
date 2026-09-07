export function greetingFor(date: Date): string {
  const hour = date.getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

export function formatLongDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(value: string): string {
  const parsed = Date.parse(value);

  if (Number.isNaN(parsed)) {
    return value;
  }

  return new Date(parsed).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function minutesToLabel(minutes: number | null): string | null {
  if (!minutes) {
    return null;
  }

  if (minutes >= 60 && minutes % 60 === 0) {
    return `${minutes / 60} hr`;
  }

  return `${minutes} min`;
}

export function preferredName(profile: {
  preferred_name: string | null;
  name: string;
} | null): string {
  if (!profile) {
    return "Sukhvinder";
  }

  return profile.preferred_name?.trim() || profile.name.split(" ")[0] || profile.name;
}

export function compareClock(a: string, b: string): number {
  return a.localeCompare(b);
}

export function currentClock(date = new Date()): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
}
