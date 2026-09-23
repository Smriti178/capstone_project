import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";
import DarkNavbar from "../components/dark/DarkNavbar";
import BookSectionRow from "../components/dark/BookSectionRow";
import CatalogueBookCard from "../components/dark/CatalogueBookCard";
import { books } from "../data/books";

const CATEGORY_LIST = [
  "All", "Romance", "Mystery", "Science Fiction", "Fantasy", "Historical",
  "Biography", "Self-help", "Memoir", "Travel", "Cooking", "Children's",
  "Young Adult", "Comics & Graphic Novels", "Poetry", "Drama", "Science",
  "Philosophy", "Religion", "Language Learning",
];

const LANGUAGES    = ["All", "English", "Hindi", "Spanish", "French"];
const FORMATS      = ["All", "Paperback", "Hardcover", "eBook", "Audiobook"];
const PRICE_RANGES = ["All", "Under ₹200", "₹200–₹400", "Above ₹400"];
const SORT_OPTIONS = ["Relevance", "Price: Low to High", "Price: High to Low", "Avg. Rating", "Newest"];

/* ── Filter dropdown ──────────────────────────────────── */
const DarkSelect = ({ label, options, value, onChange }) => (
  <div className="flex flex-col gap-1 min-w-[130px]">
    <label className="text-xs text-gray-400 whitespace-nowrap">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full bg-[#1e2535] border border-white/10 text-white text-xs rounded px-2.5 py-1.5 pr-7 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
    </div>
  </div>
);

/* ── Page ─────────────────────────────────────────────── */
const DarkCataloguePage = () => {
  const [params, setParams] = useSearchParams();
  const [language, setLanguage]   = useState("All");
  const [format, setFormat]       = useState("All");
  const [priceRange, setPriceRange] = useState("All");
  const [sort, setSort]           = useState("Relevance");
  const [search, setSearch]       = useState("");

  const activeCategory = params.get("cat") ?? "All";

  const setCategory = (cat) => {
    setSearch("");
    if (cat === "All") setParams({});
    else setParams({ cat });
  };

  /* Filter + sort */
  const filtered = useMemo(() => {
    let r = books;
    if (activeCategory && activeCategory !== "All")
      r = r.filter((b) => b.category.toLowerCase() === activeCategory.toLowerCase());
    if (search.trim())
      r = r.filter((b) =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase())
      );
    if (format !== "All")
      r = r.filter((b) => (b.format ?? "Paperback").toLowerCase() === format.toLowerCase());
    if (priceRange === "Under ₹200")  r = r.filter((b) => b.price < 200);
    if (priceRange === "₹200–₹400")  r = r.filter((b) => b.price >= 200 && b.price <= 400);
    if (priceRange === "Above ₹400") r = r.filter((b) => b.price > 400);

    if (sort === "Price: Low to High")   r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low")   r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "Avg. Rating")          r = [...r].sort((a, b) => b.rating - a.rating);
    if (sort === "Newest")               r = [...r].sort((a, b) => b.publishedYear - a.publishedYear);
    return r;
  }, [activeCategory, search, format, priceRange, sort]);

  /* Section data for default (All) view */
  const recommended = useMemo(
    () => [...books].sort((a, b) => b.rating - a.rating).slice(0, 6),
    []
  );
  const bestsellers = useMemo(
    () => books.filter((b) => b.tags?.includes("bestseller")).slice(0, 6),
    []
  );
  const newLaunches = useMemo(
    () => books.filter((b) => b.tags?.includes("new")).slice(0, 6),
    []
  );

  const showFiltered = activeCategory !== "All" || search.trim().length > 0 ||
    format !== "All" || priceRange !== "All";

  return (
    /* Full viewport dark bg — no max-width container on outer shell */
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col">
      <DarkNavbar />

      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 48px)" }}>

        {/* ── Category sidebar ─────────────────────────────── */}
        <aside className="hidden md:flex flex-col w-48 shrink-0 bg-[#0d1117] border-r border-white/5 overflow-y-auto">
          {CATEGORY_LIST.map((cat) => {
            const active =
              (cat === "All" && activeCategory === "All") ||
              activeCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`text-left px-5 py-2.5 text-sm transition-colors border-l-2 leading-tight ${
                  active
                    ? "border-blue-500 text-white font-semibold bg-white/[0.04]"
                    : "border-transparent text-gray-400 hover:text-white hover:bg-white/[0.02]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </aside>

        {/* ── Main content ─────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto flex flex-col">

          {/* Filter bar — sticky inside scroll container */}
          <div className="sticky top-0 z-10 bg-[#0d1117] border-b border-white/5 px-5 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-end flex-wrap">
            {/* Search */}
            <div className="flex flex-col gap-1 flex-1 min-w-[200px] max-w-xs">
              <label className="text-xs text-gray-400">Search you want to read here</label>
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#1e2535] border border-white/10 text-white text-xs rounded px-3 py-1.5 pr-8 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <Search size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <DarkSelect label="Language"                options={LANGUAGES}    value={language}   onChange={setLanguage} />
            <DarkSelect label="Format (Paperback, ebook etc)" options={FORMATS} value={format}    onChange={setFormat} />
            <DarkSelect label="Price Range"             options={PRICE_RANGES} value={priceRange} onChange={setPriceRange} />
            <DarkSelect label="Sort by"                 options={SORT_OPTIONS} value={sort}       onChange={setSort} />
          </div>

          {/* Book sections */}
          <div className="px-5 py-4 flex flex-col gap-6">
            {showFiltered ? (
              <section className="flex flex-col gap-3">
                <h2 className="text-base font-semibold text-white">
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                  {activeCategory !== "All" ? ` in "${activeCategory}"` : ""}
                  {search.trim() ? ` for "${search}"` : ""}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
                  {filtered.map((book, i) => (
                    <div
                      key={book.id}
                      className={`${
                        i % 3 !== 2 ? "sm:border-r border-white/5" : ""
                      } sm:px-4 first:pl-0`}
                    >
                      <CatalogueBookCard book={book} />
                    </div>
                  ))}
                </div>
                {filtered.length === 0 && (
                  <p className="text-gray-400 text-sm py-8">No books match your filters.</p>
                )}
              </section>
            ) : (
              <>
                <BookSectionRow title="Recommended for You" books={recommended} />
                <BookSectionRow title="Bestsellers this Month" books={bestsellers} />
                <BookSectionRow title="New Launches" books={newLaunches} />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DarkCataloguePage;
