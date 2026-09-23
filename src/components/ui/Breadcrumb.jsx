import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/**
 * Reusable breadcrumb navigation.
 *
 * @param {Array<{label: string, to?: string}>} items
 *   Each item has a `label`. If `to` is provided the item renders as a link,
 *   otherwise it renders as plain text (the current/active crumb).
 * @param {"light"|"dark"} theme
 *   "light" — navy hover colour, gray separator (default, used in light pages)
 *   "dark"  — blue-400 hover colour, gray-600 separator (used in dark pages)
 *
 * @example
 * // Light page
 * <Breadcrumb items={[
 *   { label: "Home", to: "/" },
 *   { label: "Books", to: "/books" },
 *   { label: "Atomic Habits" },         // no `to` = active, non-clickable
 * ]} />
 *
 * // Dark page
 * <Breadcrumb theme="dark" items={[
 *   { label: "Home", to: "/dark" },
 *   { label: "Non-Fiction", to: "/dark?cat=non-fiction" },
 *   { label: "Self Help" },
 * ]} />
 */
const Breadcrumb = ({ items = [], theme = "light" }) => {
  const isDark = theme === "dark";

  const linkCls = isDark
    ? "hover:text-blue-400 transition-colors"
    : "hover:text-[#1e3a5f] transition-colors";

  const activeCls = isDark
    ? "text-gray-200 font-medium"
    : "text-gray-900 font-medium";

  const separatorCls = isDark ? "text-gray-600" : "text-gray-400";

  const wrapperCls = isDark
    ? "flex items-center gap-1.5 text-xs text-gray-400 flex-wrap"
    : "flex items-center gap-1.5 text-sm text-gray-500 flex-wrap";

  return (
    <nav aria-label="Breadcrumb" className={wrapperCls}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <React.Fragment key={`${item.label}-${i}`}>
            {i > 0 && (
              <ChevronRight size={isDark ? 12 : 14} className={separatorCls} aria-hidden />
            )}
            {item.to && !isLast ? (
              <Link to={item.to} className={linkCls}>
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? activeCls : linkCls} aria-current={isLast ? "page" : undefined}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
