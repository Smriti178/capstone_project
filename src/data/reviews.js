/**
 * Mock reviews keyed by book id.
 * Each entry is an array of review objects.
 */
export const mockReviews = {
  b001: [
    {
      id: "r1",
      user: "Sarah M.",
      avatar: "S",
      rating: 5,
      date: "2024-01-15",
      title: "Life-changing read",
      body: "This book made me think deeply about the choices we make. Matt Haig's writing is beautifully simple yet profound. I couldn't put it down.",
      helpful: 42,
    },
    {
      id: "r2",
      user: "James T.",
      avatar: "J",
      rating: 4,
      date: "2024-02-03",
      title: "Lovely concept, slightly slow middle",
      body: "The premise is brilliant and the ending is wonderful. The middle section felt a bit repetitive but overall a 4-star experience.",
      helpful: 18,
    },
    {
      id: "r3",
      user: "Priya N.",
      avatar: "P",
      rating: 5,
      date: "2024-03-10",
      title: "A must-read for anyone at a crossroads",
      body: "I read this during a tough time in my life and it genuinely helped. Highly recommended.",
      helpful: 31,
    },
  ],
  b002: [
    {
      id: "r4",
      user: "Michael B.",
      avatar: "M",
      rating: 5,
      date: "2024-01-20",
      title: "The best productivity book I've read",
      body: "Concrete, actionable, and backed by science. James Clear has produced a masterpiece. My habits have genuinely changed since reading this.",
      helpful: 87,
    },
    {
      id: "r5",
      user: "Anna L.",
      avatar: "A",
      rating: 4,
      date: "2024-02-14",
      title: "Practical and easy to read",
      body: "Some of the ideas aren't completely new but the framework is well-structured and the examples are memorable.",
      helpful: 33,
    },
  ],
};

/**
 * Returns reviews for a given book id, falling back to generic reviews.
 */
export const getReviewsForBook = (bookId) =>
  mockReviews[bookId] ?? [
    {
      id: "r-default-1",
      user: "Book Lover",
      avatar: "B",
      rating: 4,
      date: "2024-01-01",
      title: "Great book",
      body: "Really enjoyed this one. Well written and engaging from start to finish.",
      helpful: 12,
    },
  ];
