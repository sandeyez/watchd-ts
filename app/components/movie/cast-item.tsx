import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/tmdb-utils";
import { Cast } from "tmdb-ts";

type CastItemProps = {
  cast: Cast;
};

export function CastItem({ cast }: CastItemProps) {
  const { character, name, profile_path } = cast;

  const imageUrl = getImageUrl({
    type: "profile",
    size: "w185",
    path: profile_path,
  });

  return (
    <div className="flex flex-col items-center gap-2 w-full text-center">
      <Avatar className="size-20">
        {imageUrl ? (
          <AvatarImage src={imageUrl} />
        ) : (
          <AvatarFallback>{cast.name.charAt(0)}</AvatarFallback>
        )}
      </Avatar>
      <div className="flex flex-col">
        <span className="">{name}</span>
        <span className="font-light text-sm text-muted-foreground line-clamp-2">
          {character}
        </span>
      </div>
    </div>
  );
}
