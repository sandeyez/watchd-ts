import { createRouter } from "@tanstack/react-router";

import { NotFound } from "@/components/not-found";
import { routeTree } from "./routeTree.gen";
import { SCROLL_CONTAINER_ID } from "./routes/_app";

export function getRouter() {
  const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    defaultNotFoundComponent: () => <NotFound />,
    scrollRestoration: true,
    scrollToTopSelectors: [`#${SCROLL_CONTAINER_ID}`],
  });
  return router;
}
