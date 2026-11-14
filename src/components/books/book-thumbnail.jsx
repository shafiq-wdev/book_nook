/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { BookOpenIcon } from "lucide-react";
import { cn } from "cn";

export function BookThumbnail({ image, title, className }) {
  const [failedImage, setFailedImage] = useState(null);
  const failed = !image || failedImage === image;

  if (failed) {
    return (
      <div
        className={cn(
          "flex flex-col justify-between bg-gradient-to-br from-primary/15 via-muted to-accent/30 p-2 text-muted-foreground",
          className
        )}
        aria-hidden="true"
      >
        <BookOpenIcon className="size-4 text-primary/70" />
        <span className="line-clamp-3 text-[0.6rem] leading-tight font-medium text-foreground">
          {title}
        </span>
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={`Cover of ${title}`}
      loading="lazy"
      onError={() => setFailedImage(image)}
      className={cn("object-cover", className)}
    />
  );
}