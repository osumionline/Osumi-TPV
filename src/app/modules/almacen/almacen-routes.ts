import { Route } from "@angular/router";
import { isOpenedGuardFn } from "src/app/guard/opened.guard.fn";

export const ALMACEN_ROUTES: Route[] = [
  {
    path: "",
    loadComponent: () => import("./pages/almacen/almacen.component"),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "inventario-print/:data",
    loadComponent: () =>
      import("./pages/inventario-print/inventario-print.component"),
    canActivate: [isOpenedGuardFn],
  },
];
