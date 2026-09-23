import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
import Breadcrumb from "../components/ui/Breadcrumb";
import { brands } from "../data/brands";
import { books } from "../data/books";

/* Brand card */
const BrandCard = ({ brand, bookCount }) => (
  <Link
    to={`/books?brand=${brand.id}`}
    className="group flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md hover:border-[#1e3a5f] transition-all"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{brand.logo}</span>
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-[#1e3a5f] transition-colors">
            {brand.name}
          </h3>
          <p className="text-xs text-gray-400">Est. {brand.founded}</p>
        </div>
      </div>
      <ArrowRight size={16} className="text-gray-300 group-hover:text-[#1e3a5f] transition-colors" />
    </div>
    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{brand.description}</p>
    <div className="flex items-center gap-1.5 text-xs text-gray-400">
      <BookOpen size={13} />
      <span>{bookCount} titles available</span>
    </div>
  </Link>
);

const BrandsPage = () => {
  // Count books per brand from mock data
  const bookCountByBrand = brands.reduce((acc, b) => {
    acc[b.id] = books.filter((bk) => bk.brand === b.id).length;
    return acc;
  }, {});

  return (
    <PageWrapper>
      <div className="flex flex-col gap-8">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Publishers" }]} />

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse by Publisher</h1>
          <p className="text-sm text-gray-500 mt-1">
            Explore titles from the world's leading book publishers.
          </p>
        </div>

        {/* Brand grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {brands.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              bookCount={bookCountByBrand[brand.id] ?? 0}
            />
          ))}
        </div>

        {/* All books CTA */}
        <div className="rounded-2xl bg-[#1e3a5f] px-6 sm:px-8 py-8 sm:py-10 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-1">Can't decide?</h2>
            <p className="text-white/70 text-sm">Browse our full catalogue and find your next great read.</p>
          </div>
          <Link
            to="/books"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#f59e0b] hover:bg-amber-500 px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold text-white transition-colors"
          >
            All Books <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};

export default BrandsPage;
