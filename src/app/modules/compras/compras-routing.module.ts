import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { isOpenedGuardFn } from "src/app/guard/opened.guard.fn";
import { ComprasComponent } from "src/app/modules/compras/pages/compras/compras.component";
import { PedidoComponent } from "src/app/modules/compras/pages/pedido/pedido.component";

const routes: Routes = [
  {
    path: "",
    component: ComprasComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "pedido",
    component: PedidoComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "pedido/:id",
    component: PedidoComponent,
    canActivate: [isOpenedGuardFn],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComprasRoutingModule {}
