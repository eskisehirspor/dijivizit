import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormFieldProps = React.ComponentProps<typeof Input> & {
  label: string;
  name: string;
  /** Sits opposite the label, e.g. a password recovery link. */
  labelAction?: React.ReactNode;
  /** Already-translated message; omitted when the field is valid. */
  error?: string;
};

export function FormField({
  label,
  name,
  labelAction,
  error,
  className,
  ...inputProps
}: FormFieldProps) {
  const errorId = `${name}-error`;

  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={name} className="text-xs font-medium text-muted-foreground">
          {label}
        </Label>
        {labelAction}
      </div>
      {/* The base control scale is deliberately dense for dashboard use; auth
          forms get the roomier target. */}
      <Input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn("h-10", className)}
        {...inputProps}
      />
      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
