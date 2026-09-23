/**
 * Returns a tentative delivery date range string based on today + business days.
 * @param {number} minDays  Minimum business days
 * @param {number} maxDays  Maximum business days
 * @returns {string}  e.g. "Mon, Jun 3 – Wed, Jun 5"
 */
export const getTentativeDelivery = (minDays = 3, maxDays = 5) => {
  const addBusinessDays = (date, days) => {
    const result = new Date(date);
    let added = 0;
    while (added < days) {
      result.setDate(result.getDate() + 1);
      const day = result.getDay();
      if (day !== 0 && day !== 6) added++; // skip weekends
    }
    return result;
  };

  const fmt = (d) =>
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  const today = new Date();
  return `${fmt(addBusinessDays(today, minDays))} – ${fmt(addBusinessDays(today, maxDays))}`;
};
