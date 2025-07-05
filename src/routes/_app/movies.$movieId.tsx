import { tmdb } from "@/lib/tmdb.server";
import { createFileRoute, getRouteApi, Outlet } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
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

    const [details, credits] = await Promise.all([
      tmdb.movies.details(movieId),
      tmdb.movies.credits(movieId),
    ]);

    return { ...details, ...credits };
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

export const routeApi = getRouteApi("/_app/movies/$movieId");

function RouteComponent() {
  return <Outlet />;
}
