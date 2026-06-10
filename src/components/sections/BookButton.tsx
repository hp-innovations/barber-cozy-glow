import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { SHOP } from "@/lib/shop-data";

export function BookButton({
  children = "Book Online",
  variant = "default",
  className,
  size = "lg",
}: {
  children?: ReactNode;
  variant?: "default" | "outline";
  className?: string;
  size?: "default" | "sm" | "lg";
}) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <a href={SHOP.booksyUrl} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </Button>
  );
}

export function BarberPole({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`barber-pole inline-block w-3.5 h-9 rounded-full border-2 border-brass overflow-hidden ${className}`}
    />
  );
}
