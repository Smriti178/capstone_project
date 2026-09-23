import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "../components/ui/Breadcrumb";
import PageWrapper from "../components/layout/PageWrapper";
import BookGrid from "../components/books/BookGrid";
import { books } from "../data/books";
import { categories } from "../data/categories";

const CategoryPage = () => {
  const [params, setParams] = useSearchParams();
  const activeCat = params.get("cat") ?? null;

  const filtered = useMemo(
    () => (activeCat ? books.filter((b) => b.category === activeCat) : books),
    [activeCat]
  );

  const activeCatData = categories.find((c) => c.id === activeCat);

  return (
    <PageWrapper>
      <div className="flex flex-col gap-8">
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: "Home", to: "/" },
          { label: activeCatData ? activeCatData.label : "All Categories" },
        ]} />

        {/* Page title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {activeCatData ? `${activeCatData.icon} ${activeCatData.label}` : "All Categories"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} {filtered.length === 1 ? "book" : "books"} available
          </p>
        </div>

        {/* Category pill filters — horizontally scrollable on very small screens */}
        <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:pb-0" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setParams({})}
            className={`shrink-0 rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium border transition-colors ${
              !activeCat
                ? "bg-[#1e3a5f] text-white border-[#1e3a5f]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#1e3a5f] hover:text-[#1e3a5f]"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setParams({ cat: cat.id })}
              className={`shrink-0 rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium border transition-colors ${
                activeCat === cat.id
                  ? "bg-[#1e3a5f] text-white border-[#1e3a5f]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#1e3a5f] hover:text-[#1e3a5f]"
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <BookGrid books={filtered} emptyMessage="No books in this category yet." />
      </div>
    </PageWrapper>
  );
};

export default CategoryPage;
