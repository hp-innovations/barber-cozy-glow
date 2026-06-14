export function GiftCardButton({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p
        style={{
          textAlign: "center",
          fontSize: "0.875rem",
          color: "inherit",
        }}
      >
        🎁 Purchase a Gift Card
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "16px",
        }}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: `<stripe-buy-button
  buy-button-id="buy_btn_1TiDV9AoXwPbd00dfd1PkRNX"
  publishable-key="pk_live_51ThsetAoXwPbd00dMPgAWIHjCNeIyEhnC9J65ia51ToLOaGVKRHc6DzYueafloW4xMmYkd8QNROBdeK7EFisFY3P00IYomW5ze"
></stripe-buy-button>`,
          }}
        />
      </div>
    </div>
  );
}
