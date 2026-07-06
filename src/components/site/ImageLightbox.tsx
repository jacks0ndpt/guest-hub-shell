import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
  alt?: string;
};

const ImageLightbox = ({ images, index, onIndexChange, onClose, alt }: Props) => {
  const count = images.length;
  const hasMany = count > 1;

  const prev = useCallback(
    () => onIndexChange((index - 1 + count) % count),
    [index, count, onIndexChange],
  );
  const next = useCallback(
    () => onIndexChange((index + 1) % count),
    [index, count, onIndexChange],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && hasMany) prev();
      else if (e.key === "ArrowRight" && hasMany) next();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, prev, next, hasMany]);

  if (count === 0) return null;
  const src = images[Math.max(0, Math.min(index, count - 1))];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt || "Image viewer"}
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
        className="absolute top-4 right-4 h-10 w-10 grid place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
      >
        <X className="h-5 w-5" />
      </button>

      {hasMany && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous"
            className={cn(
              "absolute left-3 md:left-6 top-1/2 -translate-y-1/2",
              "h-11 w-11 grid place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition",
            )}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next"
            className={cn(
              "absolute right-3 md:right-6 top-1/2 -translate-y-1/2",
              "h-11 w-11 grid place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition",
            )}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <div
        className="max-w-[95vw] max-h-[90vh] px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt ? `${alt} ${index + 1}` : `Image ${index + 1}`}
          className="max-w-full max-h-[85vh] object-contain rounded-md shadow-2xl mx-auto"
        />
        {hasMany && (
          <p className="mt-3 text-center text-sm text-white/80 tabular-nums">
            {index + 1} / {count}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageLightbox;
