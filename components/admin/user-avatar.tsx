import { initialsFromName } from "@/lib/admin/summary";
import { cn } from "@/lib/utils";

export function UserAvatar({
  name,
  email,
  url,
  className,
}: {
  name: string | null;
  email: string | null;
  url: string | null;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-medium text-muted-foreground ring-1 ring-border/60",
        className,
      )}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- remote storage URLs; matches the public card
        <img src={url} alt="" className="size-full object-cover" loading="lazy" />
      ) : (
        <span aria-hidden="true">{initialsFromName(name, email)}</span>
      )}
    </div>
  );
}
