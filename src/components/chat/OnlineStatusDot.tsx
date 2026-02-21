import { cn } from "@/lib/utils";

interface OnlineStatusDotProps {
  online: boolean;
  className?: string;
  size?: "sm" | "md";
}

const OnlineStatusDot = ({ online, className, size = "sm" }: OnlineStatusDotProps) => {
  const sizeClasses = size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3";

  return (
    <span
      className={cn(
        "block rounded-full border-2 border-background",
        sizeClasses,
        online ? "bg-emerald-500" : "bg-muted-foreground/30",
        className
      )}
      title={online ? "Online" : "Offline"}
    />
  );
};

export default OnlineStatusDot;
