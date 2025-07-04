import { Cast } from "tmdb-ts";
import { CastItem } from "./cast-item";
import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/tailwind";
import { Link, useParams } from "@tanstack/react-router";

type MovieCastProps = {
  cast: Cast[];
  showAll?: boolean;
};

export function MovieCast({ cast, showAll }: MovieCastProps) {
  return (
    <div
      className={cn(
        "overflow-hidden w-full @container/cast transition-[height] duration-200 ease-in-out"
      )}
    >
      <ul className="grid grid-cols-2 @sm/cast:grid-cols-3 @lg/cast:grid-cols-4 @2xl/cast:grid-cols-5 @3xl/cast:grid-cols-6 gap-x-6 gap-y-8 mt-3 *:empty:hidden">
        {showAll ? (
          cast.map((cast) => (
            <li key={cast.id}>
              <CastItem cast={cast} />
            </li>
          ))
        ) : (
          <>
            {/* First item, always visible */}
            <li>{cast[0] && <CastItem cast={cast[0]} />}</li>
            {/* Second item, always visible */}
            <li>{cast[1] && <CastItem cast={cast[1]} />}</li>
            {/* Third item, visible from @sm */}
            <li className="hidden @sm/cast:block">
              {cast[2] && <CastItem cast={cast[2]} />}
            </li>
            {/* Fourth item, visible from @lg */}
            <li className="hidden @lg/cast:block">
              {cast[3] && <CastItem cast={cast[3]} />}
            </li>
            {/* Fifth item, visible from @2xl */}
            <li className="hidden @2xl/cast:block">
              {cast[4] && <CastItem cast={cast[4]} />}
            </li>
            {/* Sixth item, visible from @3xl */}
            <li className="hidden @3xl/cast:block">
              {cast[5] && <CastItem cast={cast[5]} />}
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
