/**
 * Formats a date into a human-readable string
 */
export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString(undefined, options);
}

/**
 * Formats sex data for display
 */
export function formatSex(sex: string | null | undefined): string {
  if (!sex) return 'Not specified';

  const formatted = {
    male: 'Male',
    female: 'Female',
    'non-binary': 'Non-Binary',
    other: 'Other',
    'prefer-not-to-say': 'Prefer not to say',
  };

  return formatted[sex] || sex;
}

/**
 * Formats orientation data for display
 */
export function formatOrientation(
  orientation: string | null | undefined
): string {
  if (!orientation) return 'Not specified';

  const formatted = {
    straight: 'Straight',
    gay: 'Gay',
    lesbian: 'Lesbian',
    bisexual: 'Bisexual',
    pansexual: 'Pansexual',
    asexual: 'Asexual',
    other: 'Other',
    'prefer-not-to-say': 'Prefer not to say',
  };

  return formatted[orientation] || orientation;
}

/**
 * Gets the appropriate style for a test result badge
 */
export function getResultBadgeStyle(result: string): {
  backgroundColor: string;
} {
  switch (result) {
    case 'Positive':
      return { backgroundColor: '#d32f2f' }; // Red
    case 'Negative':
      return { backgroundColor: '#388e3c' }; // Green
    default:
      return { backgroundColor: '#757575' }; // Gray
  }
}
