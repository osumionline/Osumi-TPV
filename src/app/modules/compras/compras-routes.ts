import { Route } from "@angular/router";
import { isOpenedGuardFn } from "src/app/guard/opened.guard.fn";

export const COMPRAS_ROUTES: Route[] = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/compras/compras.component").then(
        (m) => m.ComprasComponent
      ),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "pedido",
    loadComponent: () =>
      import("./pages/pedido/pedido.component").then((m) => m.PedidoComponent),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "pedido/:id",
    loadComponent: () =>
      import("./pages/pedido/pedido.component").then((m) => m.PedidoComponent),
    canActivate: [isOpenedGuardFn],
  },
];
