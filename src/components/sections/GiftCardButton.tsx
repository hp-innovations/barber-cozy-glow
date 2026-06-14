import { useState } from "react";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function GiftCardButton({
  className,
  size = "lg",
}: {
  className?: string;
  size?: "default" | "sm" | "lg";
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size={size} className={className}>
          <Gift className="mr-2 h-4 w-4" />
          Buy a Gift Card
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 gap-0 overflow-hidden flex flex-col max-w-none w-[95vw] h-[90dvh] sm:w-[520px] sm:h-[700px]">
        <DialogTitle className="sr-only">Buy a Gift Card</DialogTitle>
        <div className="h-12 bg-background border-b border-border flex items-center justify-center relative shrink-0">
          <span className="text-sm font-medium text-foreground">
            Buy a Gift Card
          </span>
        </div>
        <iframe
          src="https://buy.stripe.com/00w28q4Mo9Pr9O4eMr7N600"
          title="Stripe Gift Card Payment"
          className="w-full flex-1 border-0 bg-white"
          allow="payment"
        />
      </DialogContent>
    </Dialog>
  );
}
