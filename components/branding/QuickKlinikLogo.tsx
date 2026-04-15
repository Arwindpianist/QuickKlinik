import { cn } from "@/lib/utils";

type QuickKlinikLogoProps = {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
  tone?: "default" | "sidebar";
};

const SIZE_CLASSES: Record<NonNullable<QuickKlinikLogoProps["size"]>, string> = {
  xs: "text-sm",
  sm: "text-base",
  md: "text-xl",
  lg: "text-3xl",
};

export function QuickKlinikLogo({ className, size = "md", tone = "default" }: QuickKlinikLogoProps) {
  const klinikToneClass = tone === "sidebar" ? "text-sidebar-foreground" : "text-foreground";

  return (
    <span
      aria-label="QuickKlinik"
      className={cn(
        "inline-flex items-baseline font-sans leading-none",
        SIZE_CLASSES[size],
        className
      )}
    >
      <span className="font-bold tracking-[-0.02em]" style={{ color: "var(--brand-primary)" }}>
        Quick
      </span>
      <span className={cn("font-extrabold tracking-[-0.03em]", klinikToneClass)}>Klinik</span>
    </span>
  );
}
