import { useState } from "react";
import { Gift, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STRIPE_PAYMENT_URL = "https://buy.stripe.com/00w28q4Mo9Pr9O4eMr7N600";

export function GiftCardButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className={className}
        onClick={() => setOpen(true)}
      >
        <Gift className="mr-2 h-4 w-4" />
        Buy a Gift Card
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-background shadow-2xl sm:h-[700px] sm:w-[520px] sm:rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow transition-colors hover:bg-accent"
            >
              <X className="h-5 w-5" />
            </button>
            <iframe
              src={STRIPE_PAYMENT_URL}
              title="Buy a Gift Card"
              className="h-full w-full border-0"
              allow="payment"
            />
          </div>
        </div>
      )}
    </>
  );
}
