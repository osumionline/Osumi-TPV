import { Route } from "@angular/router";
import { isOpenedGuardFn } from "src/app/guard/opened.guard.fn";

export const VENTAS_ROUTES: Route[] = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/ventas/ventas.component").then((m) => m.VentasComponent),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: ":id",
    loadComponent: () =>
      import("./pages/ventas/ventas.component").then((m) => m.VentasComponent),
    canActivate: [isOpenedGuardFn],
  },
];
