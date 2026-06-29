import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export type Crumb = { name: string; to: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-5 pt-6">
      <ol className="flex flex-wrap items-center gap-1.5 font-condensed text-sm text-coffee">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.to} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-leather">
                  {item.name}
                </span>
              ) : (
                <Link to={item.to} className="hover:text-leather hover:underline">
                  {item.name}
                </Link>
              )}
              {!last && (
                <ChevronRight size={14} className="text-brass" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
