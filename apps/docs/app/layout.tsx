"use client";

import * as MicroStacks from "@micro-stacks/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MicroStacks.ClientProvider
      appName="Stacks OS"
      appIconUrl="favicon.ico"
      network="mainnet"
    >
      <html lang="en">
        <body>{children}</body>
      </html>
    </MicroStacks.ClientProvider>
  );
}
