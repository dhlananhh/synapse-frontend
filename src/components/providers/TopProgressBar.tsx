"use client";

import NextNProgress from "nextjs-toploader";

export default function TopProgressBar() {
  const primaryColor = "#3b82f6";

  return (
    <NextNProgress
      color={primaryColor}
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
    />
  );
}
