import { Route } from "@angular/router";
import { isOpenedGuardFn } from "src/app/guard/opened.guard.fn";

export const CLIENTES_ROUTES: Route[] = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/clientes/clientes.component").then(
        (m) => m.ClientesComponent
      ),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: ":new",
    loadComponent: () =>
      import("./pages/clientes/clientes.component").then(
        (m) => m.ClientesComponent
      ),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "lopd/:id",
    loadComponent: () =>
      import("./pages/lopd/lopd.component").then((m) => m.LopdComponent),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "factura/:id",
    loadComponent: () =>
      import("./pages/factura/factura.component").then(
        (m) => m.FacturaComponent
      ),
    data: { type: "print" },
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "factura/:id/preview",
    loadComponent: () =>
      import("./pages/factura/factura.component").then(
        (m) => m.FacturaComponent
      ),
    data: { type: "preview" },
    canActivate: [isOpenedGuardFn],
  },
];