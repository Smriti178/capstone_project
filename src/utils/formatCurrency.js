/**
 * Format a number as INR currency string.
 * @param {number} amount  — amount in Indian Rupees
 * @returns {string}  e.g. "₹399"
 */
export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

/**
 * Calculate discount percentage between original and sale price.
 * @param {number} original
 * @param {number} sale
 * @returns {number}  e.g. 25
 */
export const discountPercent = (original, sale) =>
  Math.round(((original - sale) / original) * 100);
