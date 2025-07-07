import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/tailwind";
import { getImageUrl } from "@/lib/tmdb-utils";

type MovieCardProps = {
  posterPath: string | null;
  title: string;
  releaseDate: Date;
  className?: string;
};

export function MovieCard({
  posterPath,
  releaseDate,
  title,
  className,
}: MovieCardProps) {
  const posterSrc = getImageUrl({
    type: "poster",
    size: "w500",
    path: posterPath,
  });

  const releaseYear = releaseDate.getFullYear();

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="w-full rounded-md overflow-hidden">
        {posterSrc && (
          <img className="size-full object-cover" src={posterSrc} alt="" />
        )}
      </div>
      <div className="flex flex-col">
        <span>{title}</span>
        {!Number.isNaN(releaseYear) && (
          <span className="text-muted-foreground text-sm">{releaseYear}</span>
        )}
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
