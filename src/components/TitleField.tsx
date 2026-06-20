import { cn } from "@/lib/utils";

export function TitleField({
  value,
  onChange,
  placeholder,
  className,
  id,
  ariaLabel = "Title",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  ariaLabel?: string;
}) {
  return (
    <input
      id={id}
      name={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className={cn(
        "w-full text-2xl md:text-3xl font-semibold bg-transparent outline-none",
        "placeholder:text-muted-foreground/50 border-b border-white/10 focus:border-primary",
        className
      )}
    />
  );
}

export function DescriptionField({
  value,
  onChange,
  placeholder,
  id,
  ariaLabel = "Description",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  id?: string;
  ariaLabel?: string;
}) {
  return (
    <textarea
      id={id}
      name={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel}
      rows={2}
      className="w-full bg-transparent outline-none text-sm text-muted-foreground resize-none placeholder:text-muted-foreground/50 border-b border-white/10 focus:border-primary"
    />
  );
}
