/**
 * Format a number as USD currency string.
 * @param {number} amount
 * @returns {string}  e.g. "$14.99"
 */
export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

/**
 * Calculate discount percentage between original and sale price.
 * @param {number} original
 * @param {number} sale
 * @returns {number}  e.g. 25
 */
export const discountPercent = (original, sale) =>
  Math.round(((original - sale) / original) * 100);
