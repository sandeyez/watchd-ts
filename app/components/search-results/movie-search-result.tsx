import { CalendarIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { getImageUrl } from "@/lib/tmdb-utils";

type MovieSearchResultProps = {
  title: string;
  posterPath: string;
  releaseDate: Date;
};

export function MovieSearchResult({
  posterPath,
  releaseDate,
  title,
}: MovieSearchResultProps) {
  const releaseYear = releaseDate.getFullYear();

  return (
    <div className="h-full flex flex-col border-border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors duration-200 ease-in border border-solid rounded-md overflow-hidden bg-white ">
      <div className="w-full aspect-poster">
        <img
          src={getImageUrl({
            type: "poster",
            size: "w342",
            path: posterPath,
          })}
          className="size-full object-cover object-top"
        />
      </div>
      <div className="p-3 flex flex-col gap-1 border-t-border border-solid border-0 border-t justify-between">
        <span className="font-semibold line-clamp-2">{title}</span>
        {!Number.isNaN(releaseYear) && (
          <div className="flex text-muted-foreground items-center gap-1 text-xs">
            <CalendarIcon className="size-4" /> {releaseYear}
          </div>
        )}
      </div>
    </div>
  );
}

export function MovieSearchResultSkeleton() {
  return (
    <div className="h-full flex flex-col border-border border border-solid rounded-md overflow-hidden bg-white ">
      <div className="w-full aspect-poster">
        <Skeleton className="size-full" />
      </div>
      <div className="p-3 flex flex-col gap-1 border-t-border border-solid border-0 border-t justify-between">
        <Skeleton className="h-5 w-3/4" />
        <div className="flex text-muted-foreground items-center gap-1 text-xs">
          <Skeleton className="size-4" /> <Skeleton className="h-4 w-8" />
        </div>
      </div>
    </div>
  );
}
