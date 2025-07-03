import { MovieStat } from "@/components/movie/movie-stat";
import { Page } from "@/components/page";
import { Badge } from "@/components/ui/badge";
import { useBoundingClientRect } from "@/hooks/use-bounding-client-rect";
import { dayjs } from "@/lib/dayjs";
import { Noun } from "@/lib/language";
import { cn } from "@/lib/tailwind";
import { getImageUrl } from "@/lib/tmdb-utils";
import { tmdb } from "@/lib/tmdb.server";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { CalendarIcon, ClockIcon, StarIcon } from "lucide-react";
import { z } from "zod";

export const getMovieDetails = createServerFn({
  method: "GET",
})
  .validator(
    z.object({
      movieId: z.number(),
    })
  )
  .handler(async ({ data }) => {
    const { movieId } = data;

    const details = await tmdb.movies.details(movieId);

    return details;
  });

export const Route = createFileRoute("/_app/movies/$movieId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { movieId: movieIdAsString } = params;

    const movieId = Number(movieIdAsString);

    if (Number.isNaN(movieId)) {
      throw new Error("Invalid movieId");
    }

    const details = await getMovieDetails({
      data: { movieId: Number(movieId) },
    });

    return details;
  },
});

function RouteComponent() {
  const movie = Route.useLoaderData();

  const [metadataRef, metadataRect] = useBoundingClientRect<HTMLDivElement>();

  return (
    <Page>
      <div
        className={cn(
          "absolute -z-10 w-full overflow-clip inset-0 transition-opacity opacity-0 duration-200 ease-in",
          {
            "opacity-100": metadataRect && metadataRect?.top > 0,
          }
        )}
        style={{
          height: `calc(max(calc(${metadataRect?.top ?? 0}px - 1.5rem),0px))`,
        }}
      >
        <img
          src={getImageUrl({
            type: "backdrop",
            size: "w1280",
            path: movie.backdrop_path,
          })}
          alt=""
          className="absolute -inset-2 object-cover object-center blur-sm opacity-50 -pt-16"
        />
      </div>
      <div className="grid grid-cols-[auto_1fr_auto] gap-x-4 gap-y-6 mt-8">
        <div className="aspect-poster row-span-full w-48 rounded-lg overflow-hidden border-4 border-b-0 border-white border-solid">
          {movie.poster_path && (
            <img
              src={getImageUrl({
                type: "poster",
                size: "w500",
                path: movie.poster_path,
              })}
              className="object-cover object-top size-full"
            ></img>
          )}
        </div>
        <div className="flex flex-col mt-auto gap-y-2 h-fit" ref={metadataRef}>
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
        <div className="flex flex-col justify-end">Buttons?</div>
        <div className="flex items-center justify-between text-muted-foreground text-xs">
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
      </div>
    </Page>
  );
}
