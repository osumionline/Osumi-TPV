import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { isOpenedGuardFn } from "src/app/guard/opened.guard.fn";
import { AlmacenComponent } from "src/app/modules/almacen/pages/almacen/almacen.component";
import { InventarioPrintComponent } from "src/app/modules/almacen/pages/inventario-print/inventario-print.component";

const routes: Routes = [
  {
    path: "",
    component: AlmacenComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "inventario-print/:data",
    component: InventarioPrintComponent,
    canActivate: [isOpenedGuardFn],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlmacenRoutingModule {}
