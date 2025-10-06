import { Link, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
  CalendarIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  PlusIcon,
  StarIcon,
} from "lucide-react";
import z from "zod";

import HorizontalScroll from "@/components/horizontal-list";
import { FixedMovieHeader } from "@/components/movie/fixed-movie-header";
import { MovieCard } from "@/components/movie/movie-card";
import { MovieCast } from "@/components/movie/movie-cast";
import { MovieStat } from "@/components/movie/movie-stat";
import { WatchProviders } from "@/components/movie/watch-providers";
import { Page } from "@/components/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBoundingClientRect } from "@/hooks/use-bounding-client-rect";
import { dayjs } from "@/lib/dayjs";
import { Noun } from "@/lib/language";
import { cn, tw } from "@/lib/tailwind";
import { getImageUrl } from "@/lib/tmdb-utils";
import { tmdb } from "@/lib/tmdb.server";

import { routeApi } from "../movies.$movieId";

import type { CSSProperties } from "react";
import { useRef } from "react";
import { RequireSignIn } from "@/components/require-sign-in";
import { MoviePoster } from "@/components/movie/movie-poster";

const getRecommendedMovies = createServerFn({
  method: "GET",
})
  .validator(
    z.object({
      movieId: z.number(),
    })
  )
  .handler(async ({ data }) => {
    const { movieId } = data;

    const recommendedMovies = await tmdb.movies.recommendations(movieId);

    return {
      ...recommendedMovies,
      results: recommendedMovies.results
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 10),
    };
  });

export const Route = createFileRoute("/_app/movies/$movieId/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { movieId: movieIdAsString } = params;

    const movieId = Number(movieIdAsString);
    if (Number.isNaN(movieId)) {
      throw new Error("Invalid movieId");
    }

    const [recommendedMovies] = await Promise.all([
      getRecommendedMovies({ data: { movieId } }),
    ]);

    return {
      recommendedMovies: recommendedMovies.results,
    };
  },
});

function RouteComponent() {
  const movie = routeApi.useLoaderData();
  const { recommendedMovies } = Route.useLoaderData();

  const [metadataRef, metadataRect] = useBoundingClientRect<HTMLDivElement>();
  const titleRef = useRef<HTMLHeadingElement>(null);

  const backdropSrc = getImageUrl({
    type: "backdrop",
    size: "w1280",
    path: movie.backdrop_path,
  });

  const posterSrc = getImageUrl({
    type: "poster",
    size: "w500",
    path: movie.poster_path,
  });

  return (
    <>
      <Page
        className="space-y-12"
        beforeContent={
          <FixedMovieHeader title={movie.title} originalTitleRef={titleRef} />
        }
      >
        {backdropSrc && (
          <div
            className={cn(
              "absolute -z-10 w-full overflow-clip inset-0 transition-opacity opacity-0 duration-200 ease-in h-[22rem] md:h-[max(calc(var(--title-top)-1rem),0px)]",
              {
                "opacity-100": metadataRect && metadataRect.top > 0,
              }
            )}
            style={
              {
                "--title-top": `calc(${(metadataRect?.top ?? 0) + (typeof window === "undefined" ? 0 : window.scrollY)}px)`,
              } as CSSProperties
            }
          >
            <img
              src={backdropSrc}
              alt=""
              className="absolute -inset-2 object-cover object-center opacity-80 -pt-16 size-full"
            />
          </div>
        )}
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] gap-x-4 gap-y-6 md:gap-x-6",
            backdropSrc && "mt-16 sm:mt-48"
          )}
        >
          <div className="aspect-poster row-span-full w-48 rounded-lg overflow-hidden outline-4 outline-b-0 outline-white outline-solid">
            <MoviePoster src={posterSrc} />
          </div>
          <div
            className="flex flex-col mt-auto gap-y-2 h-fit *:empty:hidden col-span-2"
            ref={metadataRef}
          >
            <h1 className="flex" ref={titleRef}>
              {movie.title}
            </h1>
            <span className="block italic text-sm font-light text-muted-foreground">
              {movie.tagline}
            </span>
            <div className="flex gap-1">
              {movie.genres.map(({ id, name }) => (
                <Badge variant={"secondary"} key={id}>
                  {name}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs h-fit text-muted-foreground">
              {movie.vote_count > 0 && (
                <MovieStat
                  icon={<StarIcon />}
                  tooltipText={`${Intl.NumberFormat("en-EN", {
                    compactDisplay: "long",
                  }).format(
                    movie.vote_count
                  )} ${new Noun("check-in", "check-ins").toString(movie.vote_count, false)} with an average rating of ${
                    Math.round(movie.vote_average * 10) / 10
                  } / 10`}
                >
                  {
                    // Round the vote average to 1 decimal place
                    Math.round(movie.vote_average * 10) / 10
                  }
                  /10
                </MovieStat>
              )}
              {!Number.isNaN(new Date(movie.release_date).getFullYear()) && (
                <MovieStat
                  icon={<CalendarIcon />}
                  tooltipText={`${new Date(movie.release_date) > new Date() ? "Releases" : "Released"} on ${new Date(
                    movie.release_date
                  ).toLocaleDateString("en-EN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}`}
                >
                  {new Date(movie.release_date).getFullYear()}
                </MovieStat>
              )}
              {movie.runtime > 0 && (
                <MovieStat
                  icon={<ClockIcon />}
                  tooltipText={`Total runtime of ${dayjs.duration(movie.runtime, "minutes").format("H[h]m[m]")}`}
                >
                  {movie.runtime}min
                </MovieStat>
              )}
            </div>
            <RequireSignIn>
              <div className="flex flex-col gap-y-2">
                <Button variant={"default"}>
                  <CheckIcon />
                  Check-in
                </Button>
                <Button variant={"ghost"}>
                  <PlusIcon />
                  Add to watchlist
                </Button>
              </div>
            </RequireSignIn>
          </div>
          <section className="col-span-2">
            <p className="text-muted-foreground">{movie.overview}</p>
          </section>
        </div>
        {movie.cast.length > 0 && (
          <section className="space-y-3">
            <div className="w-full flex items-center justify-between">
              <h2>Cast ({movie.cast.length})</h2>
              <Link
                to={"/movies/$movieId/cast"}
                params={{ movieId: movie.id.toString() }}
              >
                <Button variant={"ghost"}>
                  Show all
                  <ChevronRightIcon />
                </Button>
              </Link>
            </div>
            <MovieCast cast={movie.cast} />
          </section>
        )}
        <section className="space-y-3">
          <h2>Where to stream?</h2>
          <WatchProviders />
        </section>
        {recommendedMovies.length > 0 && (
          <section className="space-y-3">
            <h2>More like this</h2>
            <ul className="flex gap-4 w-full [--poster-width:--spacing(36)] sm:[--poster-width:--spacing(44)] md:[--poster-width:--spacing(48)]">
              <HorizontalScroll
                key={movie.id}
                gap={16}
                showDots
                scrollButtonClassName={tw`top-[calc(var(--poster-width)*var(--aspect-poster))] translate-y-1/2`}
              >
                {recommendedMovies.map(
                  ({ id, poster_path, title, release_date, vote_average }) => (
                    <li key={id}>
                      <Link
                        to="/movies/$movieId"
                        params={{ movieId: id.toString() }}
                      >
                        <MovieCard
                          posterPath={poster_path ?? null}
                          releaseDate={new Date(release_date)}
                          title={title}
                          voteAverage={vote_average}
                          className="w-[var(--poster-width)]"
                        />
                      </Link>
                    </li>
                  )
                )}
              </HorizontalScroll>
            </ul>
          </section>
        )}
      </Page>
    </>
  );
}
