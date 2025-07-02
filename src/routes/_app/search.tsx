import { Page } from "@/components/page";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Movie, Search } from "tmdb-ts";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { tmdb } from "@/lib/tmdb.server";

export const searchMovies = createServerFn({
  method: "GET",
})
  .validator(
    z.object({
      query: z
        .string()
        .min(1, "Search query must be at least 1 character long"),
    })
  )
  .handler(async ({ data }) => {
    const results = await tmdb.search.movies({
      query: data.query,
    });

    return results;
  });

export const Route = createFileRoute("/_app/search")({
  component: RouteComponent,
  validateSearch: z.object({
    q: z.string().optional(),
  }),
});

function RouteComponent() {
  const { q } = Route.useSearch();

  const navigate = useNavigate();

  const [query, setQuery] = useState(q ?? "");
  const debouncedQuery = useDebounce(query, 200);

  const [previousDebouncedQuery, setPreviousDebouncedQuery] = useState<
    string | null
  >(null);

  const searchResults = useQuery({
    queryKey: ["searchMovies", debouncedQuery],
    queryFn: handleSearch,
  });

  async function handleSearch() {
    if (query.length < 1) {
      return null;
    }

    const results = await searchMovies({ data: { query } });

    return results;
  }

  if (debouncedQuery !== previousDebouncedQuery) {
    setPreviousDebouncedQuery(debouncedQuery);
    if (debouncedQuery) {
      navigate({ to: "/search", search: { q: debouncedQuery } });
    }
  }

  return (
    <Page
      leftElement={
        <div className="max-w-sm w-full relative">
          <Input
            className="w-full rounded-full pl-12"
            placeholder="Search through movies, shows, actors, etc."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <div className="w-12 h-full grid place-content-center absolute left-0 top-0">
            <SearchIcon className="size-5 text-muted-foreground" />
          </div>
        </div>
      }
    >
      <ul>
        {searchResults.data?.results.map(({ title }) => (
          <li>{title}</li>
        ))}
      </ul>
    </Page>
  );
}
