import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { isOpenedGuardFn } from "src/app/guard/opened.guard.fn";

const routes: Routes = [
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComprasRoutingModule {}
