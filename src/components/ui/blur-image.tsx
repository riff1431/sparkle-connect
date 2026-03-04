import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Optional low-res placeholder or dominant color (defaults to muted bg) */
  placeholderColor?: string;
}

/**
 * Image component with native lazy loading, fade-in on load,
 * and a blurred placeholder background until the image is ready.
 */
const BlurImage = ({
  className,
  placeholderColor,
  alt = "",
  loading = "lazy",
  decoding = "async",
  onLoad,
  ...props
}: BlurImageProps) => {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      setLoaded(true);
      onLoad?.(e);
    },
    [onLoad]
  );

  return (
    <div
      className={cn("relative overflow-hidden bg-muted/40", className)}
      style={placeholderColor ? { backgroundColor: placeholderColor } : undefined}
    >
      {/* Pulse placeholder shown until image loads */}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted/60 via-muted/30 to-muted/60" />
      )}
      <img
        {...props}
        alt={alt}
        loading={loading}
        decoding={decoding as any}
        onLoad={handleLoad}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500 ease-out",
          loaded ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
};

export default BlurImage;
