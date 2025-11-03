import {
  Link,
  createFileRoute,
  useLoaderData,
  useRouter,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
  CalendarIcon,
  ChevronRightIcon,
  ClockIcon,
  PlusIcon,
  StarIcon,
} from "lucide-react";
import z from "zod";

import HorizontalList from "@/components/horizontal-list";
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

import { CheckInModal } from "@/components/movie/checkin-modal";
import { MoviePoster } from "@/components/movie/movie-poster";
import { RequireSignIn } from "@/components/require-sign-in";
import { db } from "@/db/index.server";
import { movieReview } from "@/db/schemas/schema";
import { authMiddleware } from "@/middleware/auth-middleware";
import { useMutation } from "@tanstack/react-query";
import type { CSSProperties } from "react";
import { useCallback, useRef, useState } from "react";

const getRecommendedMovies = createServerFn({
  method: "GET",
})
  .inputValidator(
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

const getUserMovieReview = createServerFn({
  method: "GET",
})
  .inputValidator(
    z.object({
      movieId: z.number(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { movieId } = data;
    const review = await db.query.movieReview.findFirst({
      where: (dbReview, { eq, and }) =>
        and(eq(dbReview.movieId, movieId), eq(dbReview.userId, context.userId)),
    });
    return review;
  });

const postMovieReview = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(
    z.object({
      movieId: z.number(),
      rating: z
        .number()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must be at most 5"),
      review: z.string(),
    })
  )
  .handler(async ({ data, context }) => {
    const { movieId, rating, review } = data;

    await db.insert(movieReview).values({
      movieId,
      rating,
      review,
      userId: context.userId,
    });
  });

export const Route = createFileRoute("/_app/movies/$movieId/")({
  component: () => {
    const { movieId } = Route.useParams();

    return <RouteComponent key={movieId} />;
  },
  loader: async ({ params, context }) => {
    const { movieId: movieIdAsString } = params;

    const movieId = Number(movieIdAsString);
    if (Number.isNaN(movieId)) {
      throw new Error("Invalid movieId");
    }

    const [recommendedMovies, userReview] = await Promise.all([
      getRecommendedMovies({ data: { movieId } }),
      context.user ? getUserMovieReview({ data: { movieId } }) : null,
    ]);

    return {
      recommendedMovies: recommendedMovies.results,
      userReview,
    };
  },
  head: ({
    match: {
      context: { movie },
    },
  }) => {
    return {
      meta: [
        {
          title: `${movie.title} | Watchd`,
        },
      ],
    };
  },
});

function RouteComponent() {
  const { movie } = useLoaderData({ from: "/_app/movies/$movieId" });
  const { recommendedMovies, userReview } = Route.useLoaderData();

  const [optimisticUserHasReview, setOptimisticUserHasReview] =
    useState(!!userReview);

  const router = useRouter();

  const postMovieReviewMutation = useMutation({
    mutationFn: (data: { movieId: number; rating: number; review: string }) =>
      postMovieReview({ data }),
    onSuccess: () => {
      router.invalidate();
      setOptimisticUserHasReview(true);
    },
    onError: () => {
      setOptimisticUserHasReview(false);
    },
  });

  const handleAddToWatchlist = useCallback(async () => {
    const poster = document.querySelector("[data-poster]");
    const target = document.querySelector("[data-watchlist]");

    if (!poster || !target) return;

    const posterRect = poster.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const clone = poster.cloneNode(true) as HTMLImageElement;
    clone.style.cssText = `
        position: fixed;
        left: ${posterRect.left}px;
        top: ${posterRect.top}px;
        width: ${posterRect.width}px;
        height: ${posterRect.height}px;
        z-index: 9999;
        pointer-events: none;
        border-radius: 0.5rem;
      `;

    document.body.appendChild(clone);

    const currentPoint = {
      x: posterRect.left + 0.5 * posterRect.width + window.scrollX,
      y: posterRect.top + 0.5 * posterRect.height + window.scrollY,
    };

    const targetPoint = {
      x: targetRect.left + 0.5 * targetRect.width,
      y: targetRect.top + 0.5 * targetRect.height,
    };

    const animation = clone.animate(
      [
        {
          transform: "translate(0, 0) scale(1)",
          opacity: 1,
        },
        {
          transform: "translate(-75%, -75%) scale(1)",
          opacity: 1,
          offset: 0.25,
        },
        {
          transform: `translate(${targetPoint.x - currentPoint.x}px, ${targetPoint.y - currentPoint.y}px) scale(0)`,
          opacity: 0.5,
        },
      ],
      {
        duration: 750,
        easing: "ease-in-out",
      }
    );

    document.createElement("div").style.cssText = `
        position: fixed;
        left: ${currentPoint.x}px;
        top: ${currentPoint.y}px;
        width: ${posterRect.width}px;
        height: ${posterRect.height}px;
        z-index: 9999;
        pointer-events: none;
        border-radius: 0.5rem;
      `;

    await animation.finished;
    clone.remove();
  }, [movie.id]);

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

  // Reset the modal when the modal is closed, we do this by incrementing the key by one
  const [modalKey, setModalKey] = useState(0);

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
            backdropSrc && "mt-16 sm:mt-[calc(max(32svh,10rem))]"
          )}
        >
          <div
            className="aspect-poster row-span-full w-48 rounded-lg overflow-hidden outline-4 outline-b-0 outline-white outline-solid max-sm:m-auto"
            data-poster
          >
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
            <div className="flex flex-col gap-y-2">
              <CheckInModal
                movie={movie}
                userHasReview={optimisticUserHasReview}
                onClose={() => {
                  setTimeout(() => {
                    setModalKey((prev) => prev + 1);
                  }, 200);
                }}
                onSubmit={(rating, review) => {
                  postMovieReviewMutation.mutate({
                    movieId: movie.id,
                    rating,
                    review,
                  });
                }}
                loading={postMovieReviewMutation.isPending}
                key={modalKey}
              />
              <RequireSignIn>
                <Button variant={"ghost"} onClick={handleAddToWatchlist}>
                  <PlusIcon />
                  Add to watchlist
                </Button>
              </RequireSignIn>
            </div>
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
              <HorizontalList
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
              </HorizontalList>
            </ul>
          </section>
        )}
      </Page>
    </>
  );
}
