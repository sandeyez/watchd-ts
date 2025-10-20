import { cn } from "@/lib/tailwind";
import { getImageUrl } from "@/lib/tmdb-utils";
import { CheckIcon, CircleCheckIcon } from "lucide-react";
import type { Variants } from "motion/react";
import { LazyMotion, domAnimation, m } from "motion/react";
import { useRef, useState } from "react";
import type { MovieDetails } from "tmdb-ts";
import { RequireSignIn } from "../require-sign-in";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { UserAvatar } from "../user-avatar";
import { MoviePoster } from "./movie-poster";
import { useUser } from "@/hooks/use-user";

const textAreaContainerVariants: Variants = {
  hidden: {
    height: 0,
    overflow: "hidden",
    marginTop: -12,
    translateY: -50,
    opacity: 0,
    scale: 0.75,
    zIndex: -1,
  },
  visible: {
    height: "auto",
    overflow: "visible",
    marginTop: 0,
    translateY: 0,
    opacity: 1,
    scale: 1,
    zIndex: 0,
  },
};

const reviewOptions: Array<{
  rating: number;
  label: string;
  emoji: string;
}> = [
  {
    rating: 1,
    label: "Shitshow",
    emoji: "💩",
  },
  {
    rating: 2,
    label: "Meh...",
    emoji: "😐",
  },
  {
    rating: 3,
    label: "Okay-ish",
    emoji: "🤷‍♂️",
  },
  {
    rating: 4,
    label: "Good one",
    emoji: "🍿",
  },
  {
    rating: 5,
    label: "Brilliant",
    emoji: "👏",
  },
];

type CheckInModalProps = {
  movie: Pick<
    MovieDetails,
    "poster_path" | "backdrop_path" | "title" | "release_date"
  >;

  userHasReview: boolean;
  loading: boolean;

  onClose: () => void;
  onSubmit: (rating: number, review: string) => void;
};

export function CheckInModal({
  movie,
  userHasReview,
  onClose,
  loading = false,
  onSubmit,
}: CheckInModalProps) {
  const user = useUser();
  const [modalOpen, setModalOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isTextAreaAnimating, setIsTextAreaAnimating] = useState(false);

  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  const posterSrc = getImageUrl({
    type: "poster",
    size: "w154",
    path: movie.poster_path,
  });

  const backdropSrc = getImageUrl({
    type: "backdrop",
    size: "w780",
    path: movie.backdrop_path,
  });

  function handleOpenChange(open: boolean) {
    setModalOpen(open);

    if (!open) {
      onClose();
    }
  }

  function handleSubmit() {
    if (selectedReviewId === null) return;

    onSubmit(selectedReviewId, textareaRef.current?.value ?? "");

    handleOpenChange(false);
  }

  return (
    <Dialog
      open={modalOpen && !!user && !userHasReview}
      onOpenChange={handleOpenChange}
    >
      <RequireSignIn>
        <DialogTrigger asChild>
          {userHasReview ? (
            <Button variant={"secondary"} disabled>
              <CircleCheckIcon /> Checked in
            </Button>
          ) : (
            <Button>
              <CheckIcon />
              {loading ? "Loading..." : "Check-in"}
            </Button>
          )}
        </DialogTrigger>
      </RequireSignIn>
      <DialogContent
        showCloseButton={false}
        onKeyDown={(e) => {
          // If the user presses enter without focusing the textarea, or if the user presses enter with ctrl, we submit the form
          if (
            e.key === "Enter" &&
            (!document.activeElement?.isSameNode(textareaRef.current) ||
              e.metaKey)
          ) {
            handleSubmit();
          }
        }}
      >
        <DialogHeader hidden>
          <DialogTitle>Leave a review</DialogTitle>
          <DialogDescription>
            Rate and review the movie {movie.title}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-y-4">
          <div className="rounded-md p-3 group relative overflow-hidden border-border border-solid border-2">
            <div className="flex items-end gap-x-3">
              <div className="w-20 aspect-poster shrink-0 ">
                <MoviePoster src={posterSrc} className="rounded" />
              </div>
              <div className="flex flex-col">
                <span className="flex items-center gap-x-1 text-muted-foreground text-sm">
                  <UserAvatar className="size-[1lh]" />
                  <span className="font-semibold">{user?.name}</span>
                  watched
                </span>
                <span className="font-medium text-xl">{movie.title}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(movie.release_date).getFullYear()}
                </span>
              </div>
            </div>
            {backdropSrc && (
              <>
                <div className="absolute transition-transform duration-200 ease-out group-hover:scale-110 size-full [--extra-padding:4px] -top-[var(--extra-padding)] -left-[var(--extra-padding)] w-[calc(100%+var(--extra-padding)*2)] h-[calc(100%+var(--extra-padding)*2)] -z-20 opacity-30 blur-[2px]">
                  <img
                    src={backdropSrc}
                    alt=""
                    className="size-full object-cover"
                  />
                </div>
                <div className="absolute size-full inset-0 bg-gradient-to-b from-background/10 to-background/80 -z-10"></div>
              </>
            )}
          </div>
          <div className="flex flex-col gap-y-2">
            <span className="text-lg font-medium">What did you think?</span>
            <div className="grid grid-cols-5 gap-x-2">
              {reviewOptions.map((option) => (
                <Button
                  variant={"outline"}
                  key={option.rating}
                  className={cn(
                    "flex size-full justify-center items-center aspect-square",
                    {
                      "bg-accent text-accent-foreground":
                        selectedReviewId === option.rating,
                    }
                  )}
                  onClick={() => {
                    if (selectedReviewId === option.rating) {
                      setSelectedReviewId(null);
                    } else {
                      setSelectedReviewId(option.rating);
                      textareaRef.current?.focus();
                    }
                  }}
                >
                  <div className="flex flex-col gap-y-1">
                    <span>{option.emoji}</span>
                    <span>{option.label}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
          <LazyMotion features={domAnimation}>
            <m.div
              className="relative"
              variants={textAreaContainerVariants}
              initial="hidden"
              animate={selectedReviewId !== null ? "visible" : "hidden"}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              style={{
                zIndex: isTextAreaAnimating ? -1 : 0,
              }}
              onAnimationStart={() => setIsTextAreaAnimating(true)}
              onAnimationComplete={() => setIsTextAreaAnimating(false)}
            >
              <Textarea
                placeholder="Write a review..."
                className="resize-none"
                ref={textareaRef}
              />
            </m.div>
          </LazyMotion>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={!selectedReviewId}>
            Check-in
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
