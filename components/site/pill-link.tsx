import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Tombol pil dengan lingkaran panah (Button/Primary & Button/Glass di desain v1.0).
 * Hover: panah bergeser 4px; fokus: ring 2px.
 */
export function PillLink({
  href,
  children,
  variant = "primary",
  icon = "up-right",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "glass";
  icon?: "up-right" | "right";
  className?: string;
}) {
  const Icon = icon === "right" ? ArrowRight : ArrowUpRight;
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex h-14 items-center justify-between gap-3 rounded-full py-2 pr-2 pl-6 font-semibold outline-none transition-[filter,background-color] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variant === "primary" ? "bg-primary text-primary-foreground hover:brightness-110" : "glass text-foreground hover:bg-card",
        className,
      )}
    >
      {children}
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-full",
          variant === "primary" ? "bg-primary-foreground text-primary" : "bg-primary-soft text-foreground",
        )}
      >
        <Icon
          className={cn(
            "size-5 transition-transform duration-150 ease-out",
            icon === "right" ? "group-hover:translate-x-1" : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
          )}
          aria-hidden
        />
      </span>
    </Link>
  );
}
