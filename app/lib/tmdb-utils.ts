// Utility functions
export type TMDBImageSizes = {
  backdrop: "w300" | "w780" | "w1280" | "original";
  logo: "w45" | "w92" | "w154" | "w185" | "w300" | "w500" | "original";
  poster: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original";
  profile: "w45" | "w185" | "h632" | "original";
  still: "w92" | "w185" | "w300" | "original";
};

type GetImageUrlProps = {
  path: string | null | undefined;
} & (
  | {
      type: "backdrop";
      size: TMDBImageSizes["backdrop"];
    }
  | {
      type: "logo";
      size: TMDBImageSizes["logo"];
    }
  | {
      type: "poster";
      size: TMDBImageSizes["poster"];
    }
  | {
      type: "profile";
      size: TMDBImageSizes["profile"];
    }
  | {
      type: "still";
      size: TMDBImageSizes["still"];
    }
);

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export function getImageUrl({ path, size }: GetImageUrlProps) {
  if (typeof path !== "string" || !path) {
    return null;
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
