import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { MovieCard, MovieCardSkeleton } from "@/components/movie/movie-card";
import { Page } from "@/components/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { Noun } from "@/lib/language";
import { cn, tw } from "@/lib/tailwind";
import { tmdb } from "@/lib/tmdb.server";
import { UrlBuilderService } from "@/lib/url";

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

    return {
      ...results,
      results: results.results.sort((a, b) => b.popularity - a.popularity),
    } satisfies typeof results;
  });

export const getPopularMovies = createServerFn({
  method: "GET",
}).handler(async () => {
  const popularMovies = await tmdb.movies.popular({});

  return {
    popularQueries: popularMovies.results
      .slice(0, 6)
      .map(({ title }) => title.toLowerCase()),
  };
});

export const Route = createFileRoute("/_app/search")({
  component: RouteComponent,
  validateSearch: z.object({
    q: z.string().optional(),
  }),
  loader: async () => {
    const { popularQueries } = await getPopularMovies();

    return { popularQueries };
  },
});

const gridContainerClassName = tw`mt-4 grid xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-6`;

function RouteComponent() {
  const { q } = Route.useSearch();
  const { popularQueries } = Route.useLoaderData();

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
    navigate({
      to: "/search",
      search: { q: debouncedQuery.length > 0 ? debouncedQuery : undefined },
    });
  }

  return (
    <Page
      fullWidth
      leftElement={
        <div className="md:max-w-sm w-full relative">
          <Input
            className="w-full rounded-full px-12"
            placeholder="Search through movies, shows, actors, etc."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <div className="w-12 h-full grid place-content-center absolute left-0 top-0">
            <SearchIcon className="size-5 text-muted-foreground" />
          </div>
          <button
            onClick={() => setQuery("")}
            className={cn(
              "w-12 h-full grid place-content-center absolute right-0 top-0 opacity-0 transition-all duration-200 ease-in-out pointer-events-none cursor-pointer",
              {
                "opacity-100 pointer-events-auto": query.length > 0,
              }
            )}
          >
            <XIcon className="size-5 text-muted-foreground" />
          </button>
        </div>
      }
    >
      {(() => {
        // Initial state when no query is provided
        if (query.length === 0) {
          return (
            <div className="size-full flex items-center justify-center text-center flex-col gap-2 @container">
              <h1>Every movie ever, at your fingertips</h1>
              <span className="text-muted-foreground">
                Start typing to search through millions of movies
              </span>
              <Separator className="max-w-32 my-8" />

              <h3>Popular queries</h3>
              <div className="flex flex-wrap w-full @2xl:w-[min(40rem,80%)] gap-x-2 gap-y-3 justify-center max-w-screen mt-1">
                {popularQueries.map((popularQuery) => (
                  <Link
                    search={{ q: popularQuery }}
                    key={popularQuery}
                    to="/search"
                    onClick={() => setQuery(popularQuery)}
                  >
                    <Button variant={"secondary"} className="rounded-full">
                      {popularQuery}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          );
        }

        // If an error has occured, display the error message no matter what
        if (searchResults.isError) {
          return (
            <span className="text-red-500">
              An error occurred while searching for movies. Please try again.
            </span>
          );
        }

        // If the search results are loading, display a skeleton
        if (searchResults.isLoading || !searchResults.data) {
          return (
            <div>
              <Skeleton className="h-[calc(1lh-var(--skeleton-margin-bottom))] text-2xl w-1/2 max-w-sm mb-1 [--skeleton-margin-bottom:--spacing(1)]" />
              <Skeleton className="h-[1lh] w-68" />
              <ul className={gridContainerClassName}>
                {new Array(20).fill(null).map((_, i) => (
                  <MovieCardSkeleton key={i} />
                ))}
              </ul>
            </div>
          );
        }

        // If the search results are in, but no movies are found, display a message
        if (searchResults.data.results.length === 0) {
          return (
            <span>
              No results found for "{debouncedQuery}". Please try a different
              query.
            </span>
          );
        }

        // If movies are found, display the results
        return (
          <div>
            <h2>Search results for "{debouncedQuery}"</h2>
            <span className="text-sm text-muted-foreground">
              Found{" "}
              {new Noun("movie", "movies").toString(
                searchResults.data.results.length
              )}{" "}
              that match your search.
            </span>
            <ul className={gridContainerClassName}>
              {searchResults.data.results.map(
                ({ title, release_date, id, poster_path }) => (
                  <li key={id}>
                    <Link to={UrlBuilderService.getMoviePageUrl(id)}>
                      <MovieCard
                        title={title}
                        posterPath={poster_path}
                        releaseDate={new Date(release_date)}
                      />
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        );
      })()}
    </Page>
  );
}
