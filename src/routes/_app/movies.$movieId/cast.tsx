import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";

import { MovieCast } from "@/components/movie/movie-cast";
import { Page } from "@/components/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizeString } from "@/lib/language";

import { routeApi } from "../movies.$movieId";

export const Route = createFileRoute("/_app/movies/$movieId/cast")({
  component: RouteComponent,
  validateSearch: z.object({
    q: z.string().optional(),
  }),
});

function RouteComponent() {
  const movie = routeApi.useLoaderData();

  const [searchInput, setSearchInput] = useState("");
  const normalizedSearchInput = normalizeString(searchInput).split(" ");

  const normalizedCast = useMemo(
    () =>
      movie.cast.map((item) => ({
        ...item,
        searchKeys: [
          ...normalizeString(item.name).split(" "),
          ...normalizeString(item.character).split(" "),
          ...normalizeString(item.original_name).split(" "),
        ],
      })),
    [movie.cast]
  );

  const cast =
    normalizedSearchInput.length === 0
      ? movie.cast
      : normalizedCast.filter(({ searchKeys: keys }) => {
          return normalizedSearchInput.every((searchKey) =>
            keys.some((key) => key.includes(searchKey))
          );
        });

  return (
    <Page
      className="space-y-6"
      leftElement={
        <Route.Link to={"/movies/$movieId"}>
          <Button variant={"ghost"} className="-ml-3">
            <ArrowLeftIcon />
            Back to the movie
          </Button>
        </Route.Link>
      }
    >
      <h1>
        {movie.title} cast ({movie.cast.length})
      </h1>
      <div className="relative">
        <Input
          className="w-full rounded-full px-12"
          placeholder={`Search through the entire cast of ${movie.title}...`}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          autoFocus
        />
        <div className="w-12 h-full grid place-content-center absolute left-0 top-0">
          <SearchIcon className="size-5 text-muted-foreground" />
        </div>
      </div>
      <MovieCast cast={cast} showAll />
    </Page>
  );
}
