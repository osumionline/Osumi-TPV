import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { isOpenedGuardFn } from "src/app/guard/opened.guard.fn";

const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/almacen/almacen.component").then(
        (m) => m.AlmacenComponent
      ),
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "inventario-print/:data",
    loadComponent: () =>
      import("./pages/inventario-print/inventario-print.component").then(
        (m) => m.InventarioPrintComponent
      ),
    canActivate: [isOpenedGuardFn],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlmacenRoutingModule {}
