import { Await, Link, createFileRoute } from "@tanstack/react-router";

import { GradientText } from "@/components/gradient-text";
import HorizontalList from "@/components/horizontal-list";
import { MovieCard } from "@/components/movie/movie-card";
import { Page } from "@/components/page";
import { db } from "@/db/index.server";
import { useUser } from "@/hooks/use-user";
import { typedObjectFromEntries } from "@/lib/objects";
import { tmdb } from "@/lib/tmdb.server";
import { authMiddleware } from "@/middleware/auth-middleware";
import { createServerFn } from "@tanstack/react-start";

// Recommendations refresh daily on 9:00 AM UTC
function getNextRecommendationRefresh() {
  const now = new Date();
  const nextRefresh = new Date(new Date(now).setUTCHours(9, 0, 0, 0));

  if (now > nextRefresh) {
    return new Date(nextRefresh.setDate(nextRefresh.getDate() + 1));
  }

  return nextRefresh;
}

const MOVIES_TO_FETCH = 10;
const RECOMMENDATION_COUNT = 4;

export const getRecommendedMovies = createServerFn({
  method: "GET",
})
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.userId;

    const now = new Date();

    const thresholdDate = new Date(new Date().setDate(now.getDate() - 30));

    // Query 15 most recent reviews for this user that occurred in the last 30 days
    const recentReviewsPromise = db.query.movieReview.findMany({
      where: (dbReview, { eq, and, gte, inArray }) =>
        and(
          eq(dbReview.userId, userId),
          gte(dbReview.createdAt, thresholdDate),
          inArray(dbReview.rating, [4, 5])
        ),
      orderBy: (dbReview, { desc }) => desc(dbReview.createdAt),
      limit: MOVIES_TO_FETCH,
    });

    const reviewedIdsPromise = db.query.movieReview
      .findMany({
        where: (dbReview, { eq }) => eq(dbReview.userId, userId),
        columns: {
          movieId: true,
        },
      })
      .then((reviews) => new Set(reviews.map((review) => review.movieId)));

    const [recentReviews, reviewedIds] = await Promise.all([
      recentReviewsPromise,
      reviewedIdsPromise,
    ]);

    // Computing recommended movies based on recent reviews happens as follows:
    // - For all (at most 15) recent movies, recommendations are fetched from the TMDB API.
    // - These recommendations are combined into a single list, where movies that occur in multiple recommendations are sorted earlier.
    // - Filter out the movies that the user has already reviewed.
    // - The movies that got recommended based on movies with a rating of 3 are put at the end of the list.
    // - From the sorted list, a random subset of 5 movies is picked and returned. Make sure that movies ranked higher are more likely to be picked.
    const movieEntries = await Promise.all(
      recentReviews.flatMap(async ({ movieId }) => {
        const recommendedMoviesForId =
          await tmdb.movies.recommendations(movieId);

        return recommendedMoviesForId.results.filter(
          ({ id }) => !reviewedIds.has(id)
        );
      })
    ).then((arr) => arr.flat().map((movie) => [movie.id, movie] as const));

    const moviesObject = typedObjectFromEntries(movieEntries);

    const moviesCount = movieEntries.reduce<Record<number, number>>(
      (acc, [id]) => {
        acc[id] = (acc[id] || 0) + 1;

        return acc;
      },
      {}
    );

    const maxCount = Math.max(...Object.values(moviesCount));

    const recommendationsSortedByCount = Object.keys(moviesCount)
      .sort((a, b) => {
        if (moviesCount[a] !== moviesCount[b])
          return moviesCount[b] - moviesCount[a];

        return (
          moviesObject[Number(a)].popularity -
          moviesObject[Number(b)].popularity
        );
      })
      .map((id) => moviesObject[Number(id)]);

    return recommendationsSortedByCount.reduce((acc, movie, index) => {
      const moviesToPick = RECOMMENDATION_COUNT - acc.length;

      // If there are no movies left to pick, return the accumulated movies
      if (moviesToPick === 0) return acc;

      // If the movie must be picked to reach the recommendation count, pick it by default
      if (index >= recommendationsSortedByCount.length - moviesToPick)
        return [...acc, movie];

      const chance = Math.min(moviesCount[movie.id] / maxCount, 0.8);

      if (chance > Math.random()) return [...acc, movie];

      return acc;
    }, []);
  });

export const Route = createFileRoute("/_app/home")({
  component: RouteComponent,
  loader: ({ context }) => {
    const recommendedMoviesPromise = context.user
      ? getRecommendedMovies().catch(() => [])
      : Promise.resolve([]);

    const nextRecommendationRefresh = getNextRecommendationRefresh();

    return {
      recommendedMoviesPromise,
      nextRecommendationRefresh,
    };
  },
});

function RouteComponent() {
  const user = useUser();

  const data = Route.useLoaderData();

  return (
    <Page className="space-y-8">
      <h1>
        {user ? (
          `Welcome back, ${user.firstName}`
        ) : (
          <span className="inline-flex gap-1.5">
            Welcome to{" "}
            <GradientText>
              <span className="font-black">watchd.</span>
            </GradientText>
          </span>
        )}
      </h1>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-x-3">
          <h2 className="inline-flex">Daily recommendations for you</h2>
          <span className="text-sm text-muted-foreground"></span>
        </div>
        <Await
          promise={data.recommendedMoviesPromise}
          fallback={<div>Loading...</div>}
        >
          {(recommendedMovies) => (
            <HorizontalList>
              {recommendedMovies.map((movie) => (
                <li key={movie.id}>
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: movie.id.toString() }}
                  >
                    <MovieCard
                      posterPath={movie.poster_path}
                      releaseDate={new Date(movie.release_date)}
                      title={movie.title}
                      className="w-40"
                    />
                  </Link>
                </li>
              ))}
            </HorizontalList>
          )}
        </Await>
      </section>
    </Page>
  );
}
