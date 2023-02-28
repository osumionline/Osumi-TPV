import { Route } from "@angular/router";
import { isOpenedGuardFn } from "src/app/guard/opened.guard.fn";

export const CAJA_ROUTES: Route[] = [
  {
    path: "",
    loadComponent: () => import("./pages/caja/caja.component"),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "informes/detallado/:year/:month",
    loadComponent: () =>
      import("./pages/informe-detallado/informe-detallado.component"),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "informes/simple/:year/:month",
    loadComponent: () =>
      import("./pages/informe-simple/informe-simple.component"),
    canActivate: [isOpenedGuardFn],
  },
];
