import { books } from "../data/books";

/**
 * Generates personalised book recommendations based on a user's order history.
 *
 * Strategy (in priority order):
 * 1. Books from the same categories as previously purchased books (category affinity)
 * 2. Books from the same authors as previously purchased books (author affinity)
 * 3. Boost score for highly-rated books (rating ≥ 4.5)
 * 4. Exclude books the user has already purchased
 * 5. Return the top `limit` results sorted by score descending
 *
 * @param {Array} orders - Enriched order array from OrderContext
 * @param {number} limit - Max number of recommendations to return
 * @returns {Array} Sorted array of recommended book objects with a `_score` property
 */
export const getRecommendations = (orders = [], limit = 10) => {
  // Collect purchased book IDs, categories, and authors from order history
  const purchasedIds = new Set();
  const categoryCount = {};   // category → purchase count
  const authorCount = {};     // author   → purchase count

  for (const order of orders) {
    if (order.status === "cancelled") continue; // ignore cancelled orders
    for (const item of order.items ?? []) {
      const book = item.book;
      if (!book) continue;
      purchasedIds.add(book.id);
      categoryCount[book.category] = (categoryCount[book.category] ?? 0) + (item.quantity ?? 1);
      authorCount[book.author] = (authorCount[book.author] ?? 0) + (item.quantity ?? 1);
    }
  }

  // Score every book that hasn't been purchased
  const candidates = books
    .filter((b) => !purchasedIds.has(b.id))
    .map((b) => {
      let score = 0;

      // Category affinity (weight: 3 per purchase in that category)
      score += (categoryCount[b.category] ?? 0) * 3;

      // Author affinity (weight: 5 per purchase by that author)
      score += (authorCount[b.author] ?? 0) * 5;

      // Rating boost (books rated ≥ 4.5 get +2, ≥ 4.0 get +1)
      if (b.rating >= 4.5) score += 2;
      else if (b.rating >= 4.0) score += 1;

      // Bestseller tag boost
      if (b.tags?.includes("bestseller")) score += 1;

      return { ...b, _score: score };
    });

  // Sort: personalised first (score > 0), then top-rated fallback
  candidates.sort((a, b) => {
    if (b._score !== a._score) return b._score - a._score;
    return b.rating - a.rating; // tie-break by rating
  });

  return candidates.slice(0, limit);
};

/**
 * Returns true if the user has any non-cancelled order history,
 * meaning we can generate meaningful personalised recommendations.
 */
export const hasOrderHistory = (orders = []) =>
  orders.some((o) => o.status !== "cancelled" && (o.items?.length ?? 0) > 0);
