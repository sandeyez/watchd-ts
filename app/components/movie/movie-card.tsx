import { cn } from "@/lib/tailwind";
import { getImageUrl } from "@/lib/tmdb-utils";

import { Skeleton } from "../ui/skeleton";
import { StarIcon } from "lucide-react";
import { MoviePoster } from "./movie-poster";

type MovieCardProps = {
  posterPath: string | null | undefined;
  title: string;
  releaseDate?: Date;
  voteAverage?: number;
  className?: string;
};

export function MovieCard({
  posterPath,
  releaseDate,
  title,
  voteAverage,
  className,
}: MovieCardProps) {
  const posterSrc = getImageUrl({
    type: "poster",
    size: "w500",
    path: posterPath,
  });

  const releaseYear = releaseDate?.getFullYear();

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <MoviePoster src={posterSrc} />
      <div className="flex flex-col">
        <span>{title}</span>
        <div className="flex items-center gap-2 text-muted-foreground ">
          {releaseYear && !Number.isNaN(releaseYear) && (
            <span className="text-sm">{releaseYear}</span>
          )}
          <div className="h-4 w-px bg-muted first:hidden last:hidden" />
          {voteAverage && (
            <>
              <div className="flex items-center gap-1">
                <StarIcon className="fill-yellow-300 size-4 text-transparent" />
              </div>
              <span className="text-sm">{voteAverage.toFixed(1)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-poster w-full rounded-md" />
      <div className="flex flex-col gap-1 [--skeleton-gap:--spacing(1)]">
        <Skeleton className="h-[calc(1lh-var(--skeleton-gap))] w-3/4" />
        <Skeleton className="h-[calc(1lh-var(--skeleton-gap))] text-sm w-16" />
      </div>
    </div>
  );
}
