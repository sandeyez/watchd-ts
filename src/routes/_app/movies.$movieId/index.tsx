import { Link, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
  CalendarIcon,
  ChevronRightIcon,
  ClockIcon,
  StarIcon,
} from "lucide-react";
import z from "zod";
import { routeApi } from "../movies.$movieId";
import { MovieCast } from "@/components/movie/movie-cast";
import { MovieStat } from "@/components/movie/movie-stat";
import { WatchProviders } from "@/components/movie/watch-providers";
import { Page } from "@/components/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBoundingClientRect } from "@/hooks/use-bounding-client-rect";
import { dayjs } from "@/lib/dayjs";
import { Noun } from "@/lib/language";
import { cn } from "@/lib/tailwind";
import { getImageUrl } from "@/lib/tmdb-utils";
import { tmdb } from "@/lib/tmdb.server";

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

    const similarMovies = await tmdb.movies.recommendations(movieId);

    return similarMovies;
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

  const [metadataRef, metadataRect] = useBoundingClientRect<HTMLDivElement>();

  const backdropImageUrl = getImageUrl({
    type: "backdrop",
    size: "w1280",
    path: movie.backdrop_path,
  });

  const posterImageUrl = getImageUrl({
    type: "poster",
    size: "w500",
    path: movie.poster_path,
  });

  return (
    <Page className="space-y-12">
      {backdropImageUrl && (
        <div
          className={cn(
            "absolute -z-10 w-full overflow-clip inset-0 transition-opacity opacity-0 duration-200 ease-in",
            {
              "opacity-100": metadataRect && metadataRect.top > 0,
            }
          )}
          style={{
            height: `calc(max(calc(${(metadataRect?.top ?? 0) + (typeof window === "undefined" ? 0 : window.scrollY)}px - 1rem),0px))`,
          }}
        >
          <img
            src={backdropImageUrl}
            alt=""
            className="absolute -inset-2 object-cover object-center opacity-80 -pt-16 size-full"
          />
        </div>
      )}
      <div
        className={cn(
          "grid grid-cols-[auto_1fr_auto] gap-x-6 gap-y-8",
          backdropImageUrl && "mt-48"
        )}
      >
        <div className="aspect-poster row-span-full w-48 rounded-lg overflow-hidden outline-4 outline-b-0 outline-white outline-solid">
          {posterImageUrl && (
            <img
              src={posterImageUrl}
              className="object-cover object-top size-full"
            ></img>
          )}
        </div>
        <div
          className="flex flex-col mt-auto gap-y-2 h-fit col-span-2"
          ref={metadataRef}
        >
          <h1 className="">{movie.title}</h1>
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
        <div className="flex items-center justify-between text-muted-foreground text-xs h-fit">
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
              tooltipText={`Released on ${new Date(
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
        <section className="col-span-2">
          <p className="text-muted-foreground">{movie.overview}</p>
        </section>
      </div>
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
      <section className="space-y-3">
        <h2>Where to stream?</h2>
        <WatchProviders />
      </section>
      <section className="space-y-3">
        <h2>Where to stream?</h2>
        
        </section>
    </Page>
  );
}
