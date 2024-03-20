import { Route } from "@angular/router";
import { isOpenedGuardFn } from "@app/guard/opened.guard.fn";

export const ALMACEN_ROUTES: Route[] = [
  {
    path: "",
    loadComponent: () =>
      import("@modules/almacen/pages/almacen/almacen.component"),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "inventario-print/:data",
    loadComponent: () =>
      import(
        "@modules/almacen/pages/inventario-print/inventario-print.component"
      ),
    canActivate: [isOpenedGuardFn],
  },
];
