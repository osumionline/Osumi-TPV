import { Route } from "@angular/router";
import { isOpenedGuardFn } from "@app/guard/opened.guard.fn";

export const VENTAS_ROUTES: Route[] = [
  {
    path: "",
    loadComponent: () =>
      import("@modules/ventas/pages/ventas/ventas.component"),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: ":id",
    loadComponent: () =>
      import("@modules/ventas/pages/ventas/ventas.component"),
    canActivate: [isOpenedGuardFn],
  },
];
