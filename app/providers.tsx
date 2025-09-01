"use client";

// Si luego quieres agregar ThemeProvider u otros, hazlo aquí.
// Por ahora, solo dejamos un provider vacío que no rompe nada.

import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
