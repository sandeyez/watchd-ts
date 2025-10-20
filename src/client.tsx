// src/client.tsx
import { StartClient } from "@tanstack/react-start/client";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

import * as React from "react";

hydrateRoot(
  document,
  <StrictMode>
    <StartClient />
  </StrictMode>
);
