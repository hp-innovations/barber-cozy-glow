import { Button } from "@/components/ui/button";

export function BookButton({
  children = "Book Online",
  variant = "default",
  className,
  size = "lg",
}: {
  children?: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
  size?: "default" | "sm" | "lg";
}) {
  const { SHOP } = require("@/lib/shop-data");
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <a href={SHOP.booksyUrl} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </Button>
  );
}
