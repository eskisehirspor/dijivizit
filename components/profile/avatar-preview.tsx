import { User } from "lucide-react";

import { cn } from "@/lib/utils";

export function AvatarPreview({
  src,
  alt,
  className,
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  return (
    <div className={cn("shrink-0", className)}>
      {src ? (
        // Plain <img>: next/image optimization was failing to display storage URLs in the dashboard preview.
        // eslint-disable-next-line @next/next/no-img-element -- remote storage URLs; next/image failed in-app
        <img
          src={src}
          alt={alt}
          style={{
            width: "112px",
            height: "112px",
            objectFit: "cover",
            borderRadius: "12px",
            border: "1px solid #ccc",
          }}
        />
      ) : (
        <div
          className="flex items-center justify-center bg-muted text-muted-foreground"
          style={{
            width: "112px",
            height: "112px",
            borderRadius: "12px",
            border: "1px solid #ccc",
          }}
        >
          <User aria-hidden="true" className="size-8" />
        </div>
      )}
    </div>
  );
}
