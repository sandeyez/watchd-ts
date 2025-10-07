// src/routes/__root.tsx
/// <reference types="vite/client" />
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";

import { NotFound } from "@/components/not-found";
import { CountryProvider } from "@/contexts/country-context";
import { LocalStorageConfigProvider } from "@/contexts/local-storage-context";
import appCss from "@/styles/app.css?url";

import type { ReactNode } from "react";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Watchd",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <LocalStorageConfigProvider>
        <CountryProvider>
          <Analytics />
          <RootDocument>
            <Outlet />
          </RootDocument>
        </CountryProvider>
      </LocalStorageConfigProvider>
    </QueryClientProvider>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
