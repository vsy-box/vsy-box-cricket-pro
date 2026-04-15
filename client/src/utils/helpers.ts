/**
 * Formats an hour number (0-23) into a readable time label.
 */
export const formatHour = (hour: number): string => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${display}:00 ${period}`;
};

/**
 * Formats a date string (YYYY-MM-DD) to a readable format.
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Returns today's date in YYYY-MM-DD format.
 */
export const getTodayStr = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

/**
 * Generates an array of dates starting from today up to `days` ahead.
 */
export const getDateRange = (days: number): string[] => {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }

  return dates;
};

/**
 * Gets day name from date string.
 */
export const getDayName = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', { weekday: 'long' });
};

/**
 * Checks if a date is a weekend.
 */
export const isWeekend = (dateStr: string): boolean => {
  const date = new Date(dateStr + 'T00:00:00');
  const day = date.getDay();
  return day === 0 || day === 6;
};

/**
 * Formats currency in INR.
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Gets a relative time string for a date.
 */
export const getRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr.split('T')[0]);
};

/**
 * Checks if a slot time has passed.
 */
export const isPastSlot = (dateStr: string, hour: number): boolean => {
  const slotDate = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (slotDate < today) return true;
  if (slotDate > today) return false;
  
  // Same day, check hour
  return now.getHours() >= (hour + 1); // Slot is 1 hour long, so if current hour is past the end of the slot
};
