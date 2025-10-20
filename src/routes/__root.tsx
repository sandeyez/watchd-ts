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

import { auth } from "@/auth";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import type { ReactNode } from "react";

const getUser = createServerFn({ method: "GET" }).handler(async () => {
  const request = await getRequest();

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const user = session?.user;

  return user;
});

export const Route = createRootRoute({
  beforeLoad: async () => {
    const user = await getUser();

    return {
      user,
    };
  },
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
    <html className="overscroll-none">
      <head>
        <HeadContent />
      </head>
      <body className="h-screen w-screen size-full bg-background antialiased overflow-x-clip overflow-y-auto overscroll-none">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
