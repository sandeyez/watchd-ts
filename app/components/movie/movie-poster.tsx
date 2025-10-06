type MoviePosterProps = {
  src: string | null;
};

export function MoviePoster({ src }: MoviePosterProps) {
  return (
    <div className="w-full rounded-md overflow-hidden aspect-poster">
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
