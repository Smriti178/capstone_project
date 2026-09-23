import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "../../context/CartContext";
import BookCard from "../../components/books/BookCard";
import BookGrid from "../../components/books/BookGrid";
import { books } from "../../data/books";

const mockBook = books[0]; // "The Midnight Library" — has bestseller tag

const renderCard = (book = mockBook, size = "md") =>
  render(
    <MemoryRouter>
      <CartProvider>
        <BookCard book={book} size={size} />
      </CartProvider>
    </MemoryRouter>
  );

const renderGrid = (bookList) =>
  render(
    <MemoryRouter>
      <CartProvider>
        <BookGrid books={bookList} />
      </CartProvider>
    </MemoryRouter>
  );

// ---------------------------------------------------------------------------
// BookCard
// ---------------------------------------------------------------------------
describe("BookCard — rendering", () => {
  test("displays the book title", () => {
    renderCard();
    expect(screen.getByRole("heading", { name: mockBook.title })).toBeInTheDocument();
  });

  test("displays the author", () => {
    renderCard();
    expect(screen.getByText(mockBook.author)).toBeInTheDocument();
  });

  test("links to the correct product page", () => {
    renderCard();
    expect(screen.getByRole("link")).toHaveAttribute("href", `/books/${mockBook.id}`);
  });

  test("shows a discount badge when originalPrice > price", () => {
    renderCard();
    expect(screen.getByText(/-\d+%/)).toBeInTheDocument();
  });

  test("shows bestseller badge in md size", () => {
    const b = books.find((bk) => bk.tags?.includes("bestseller"));
    renderCard(b, "md");
    expect(screen.getByText(/bestseller/i)).toBeInTheDocument();
  });

  test("hides tags in sm size", () => {
    const b = books.find((bk) => bk.tags?.includes("bestseller"));
    renderCard(b, "sm");
    expect(screen.queryByText(/bestseller/i)).not.toBeInTheDocument();
  });

  test("shows 'Add to Cart' button in md size", () => {
    renderCard(mockBook, "md");
    expect(screen.getByRole("button", { name: /add to cart/i })).toBeInTheDocument();
  });

  test("hides 'Add to Cart' button in sm size", () => {
    renderCard(mockBook, "sm");
    expect(screen.queryByRole("button", { name: /add to cart/i })).not.toBeInTheDocument();
  });
});

describe("BookCard — Add to Cart", () => {
  test("clicking 'Add to Cart' shows 'Added!' feedback", async () => {
    renderCard();
    await userEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    expect(await screen.findByRole("button", { name: /added!/i })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// BookGrid
// ---------------------------------------------------------------------------
describe("BookGrid — rendering", () => {
  test("renders a card for each book in the list", () => {
    renderGrid(books.slice(0, 3));
    expect(screen.getAllByRole("link").length).toBeGreaterThanOrEqual(3);
  });

  test("renders default empty state message when books array is empty", () => {
    renderGrid([]);
    expect(screen.getByText(/no books found/i)).toBeInTheDocument();
  });

  test("renders a custom empty message when provided", () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <BookGrid books={[]} emptyMessage="No titles match your filters." />
        </CartProvider>
      </MemoryRouter>
    );
    expect(screen.getByText("No titles match your filters.")).toBeInTheDocument();
  });
});
