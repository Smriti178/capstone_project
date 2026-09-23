/**
 * Determines whether an order is still within the 48-hour cancellation window.
 * @param {string} orderDate  ISO date string of when the order was placed
 * @returns {boolean}
 */
export const isCancellable = (orderDate) => {
  const placed = new Date(orderDate).getTime();
  const now = Date.now();
  const fortyEightHours = 48 * 60 * 60 * 1000;
  return now - placed < fortyEightHours;
};

/**
 * Returns the time remaining in the cancellation window as a human-readable string.
 * @param {string} orderDate
 * @returns {string|null}  e.g. "23h 15m remaining" or null if window has passed
 */
export const cancellationTimeRemaining = (orderDate) => {
  const placed = new Date(orderDate).getTime();
  const now = Date.now();
  const fortyEightHours = 48 * 60 * 60 * 1000;
  const remaining = fortyEightHours - (now - placed);

  if (remaining <= 0) return null;

  const hours = Math.floor(remaining / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  return `${hours}h ${minutes}m remaining`;
};
