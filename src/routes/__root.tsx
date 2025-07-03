// src/routes/__root.tsx
/// <reference types="vite/client" />
import { ClerkProvider } from "@clerk/tanstack-react-start";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "@/styles/app.css?url";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
});

function RootComponent() {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          userButtonAvatarBox: "outline-2 outline-solid outline-white",
        },
      }}
    >
      <QueryClientProvider client={new QueryClient()}>
        <RootDocument>
          <Outlet />
        </RootDocument>
      </QueryClientProvider>
    </ClerkProvider>
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
