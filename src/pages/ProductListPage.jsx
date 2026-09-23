import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
import Breadcrumb from "../components/ui/Breadcrumb";
import BookGrid from "../components/books/BookGrid";
import { books } from "../data/books";
import { categories } from "../data/categories";
import { brands } from "../data/brands";

/* ── Sort options ────────────────────────────────────── */
const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Avg. Rating" },
  { value: "newest", label: "Newest First" },
];

/* ── Small filter pill ───────────────────────────────── */
const FilterPill = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-[#1e3a5f]/10 px-3 py-1 text-xs font-medium text-[#1e3a5f]">
    {label}
    <button onClick={onRemove} aria-label={`Remove ${label} filter`} className="hover:text-red-500 ml-0.5">
      <X size={11} />
    </button>
  </span>
);

/* ── Sidebar filter panel ────────────────────────────── */
const FilterPanel = ({ params, setParams, onClose }) => {
  const activeCat = params.get("cat");
  const activeBrand = params.get("brand");
  const activeTag = params.get("tag");
  const maxPrice = params.get("maxPrice");

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  const tags = ["bestseller", "new", "award-winner", "classic"];

  return (
    <aside className="flex flex-col gap-6 text-sm">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-900">Filters</span>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <p className="font-medium text-gray-700 mb-2">Category</p>
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => setFilter("cat", activeCat === cat.id ? null : cat.id)}
                className={`w-full text-left px-2 py-1.5 rounded-lg transition-colors ${
                  activeCat === cat.id
                    ? "bg-[#1e3a5f] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Publisher */}
      <div>
        <p className="font-medium text-gray-700 mb-2">Publisher</p>
        <ul className="space-y-1">
          {brands.map((brand) => (
            <li key={brand.id}>
              <button
                onClick={() =>
                  setFilter("brand", activeBrand === brand.id ? null : brand.id)
                }
                className={`w-full text-left px-2 py-1.5 rounded-lg transition-colors ${
                  activeBrand === brand.id
                    ? "bg-[#1e3a5f] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {brand.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      <div>
        <p className="font-medium text-gray-700 mb-2">Tags</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter("tag", activeTag === tag ? null : tag)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors capitalize ${
                activeTag === tag
                  ? "bg-[#1e3a5f] text-white border-[#1e3a5f]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#1e3a5f]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Max price */}
      <div>
        <p className="font-medium text-gray-700 mb-2">
          Max Price: <span className="text-[#1e3a5f]">${maxPrice ?? 30}</span>
        </p>
        <input
          type="range"
          min={5}
          max={30}
          step={1}
          value={maxPrice ?? 30}
          onChange={(e) => setFilter("maxPrice", e.target.value)}
          className="w-full accent-[#1e3a5f]"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>$5</span><span>$30</span>
        </div>
      </div>

      {/* Clear all */}
      <button
        onClick={() => setParams({})}
        className="text-xs text-red-500 hover:underline text-left"
      >
        Clear all filters
      </button>
    </aside>
  );
};

/* ── Page ────────────────────────────────────────────── */
const ProductListPage = () => {
  const [params, setParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeCat = params.get("cat");
  const activeBrand = params.get("brand");
  const activeTag = params.get("tag");
  const maxPrice = parseFloat(params.get("maxPrice") ?? 30);
  const sort = params.get("sort") ?? "relevance";
  const query = params.get("q") ?? "";

  const filtered = useMemo(() => {
    let result = [...books];
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
      );
    }
    if (activeCat) result = result.filter((b) => b.category === activeCat);
    if (activeBrand) result = result.filter((b) => b.brand === activeBrand);
    if (activeTag) result = result.filter((b) => b.tags?.includes(activeTag));
    result = result.filter((b) => b.price <= maxPrice);

    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sort === "newest") result.sort((a, b) => b.publishedYear - a.publishedYear);

    return result;
  }, [activeCat, activeBrand, activeTag, maxPrice, sort, query]);

  // Active filter pills
  const activeFilters = [
    activeCat && { key: "cat", label: categories.find((c) => c.id === activeCat)?.label },
    activeBrand && { key: "brand", label: brands.find((b) => b.id === activeBrand)?.name },
    activeTag && { key: "tag", label: activeTag },
    query && { key: "q", label: `"${query}"` },
  ].filter(Boolean);

  const removeFilter = (key) => {
    const next = new URLSearchParams(params);
    next.delete(key);
    setParams(next);
  };

  const setSort = (value) => {
    const next = new URLSearchParams(params);
    next.set("sort", value);
    setParams(next);
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Books" }]} />

        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {query ? `Results for "${query}"` : "All Books"}
            </h1>
            <p className="text-sm text-gray-500">{filtered.length} books found</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <SlidersHorizontal size={15} /> Filters
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-8 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Active filter pills */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500">Active:</span>
            {activeFilters.map((f) => (
              <FilterPill key={f.key} label={f.label} onRemove={() => removeFilter(f.key)} />
            ))}
          </div>
        )}

        {/* Body: sidebar + grid */}
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-56 shrink-0">
            <FilterPanel params={params} setParams={setParams} />
          </div>

          {/* Book grid */}
          <div className="flex-1 min-w-0">
            <BookGrid books={filtered} emptyMessage="No books match your filters." />
          </div>
        </div>

        {/* Mobile filter drawer overlay */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="relative ml-auto h-full w-72 max-w-full overflow-y-auto bg-white p-6 shadow-xl">
              <FilterPanel
                params={params}
                setParams={setParams}
                onClose={() => setMobileFiltersOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default ProductListPage;
