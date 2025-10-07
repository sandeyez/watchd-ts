import { cn } from "@/lib/tailwind";

type MoviePosterProps = {
  src: string | null;
  className?: string;
};

export function MoviePoster({ src, className }: MoviePosterProps) {
  return (
    <div
      className={cn(
        "w-full rounded-md overflow-hidden aspect-poster",
        className
      )}
    >
      {src ? (
        <img className="size-full object-cover" src={src} alt="" />
      ) : (
        <div className="size-full bg-accent grid place-content-center">
          <div className="rounded-full p-4 bg-transparent border-border border-solid border-[4rem]"></div>
        </div>
      )}
    </div>
  );
}
