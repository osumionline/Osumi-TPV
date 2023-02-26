import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { isOpenedGuardFn } from "src/app/guard/opened.guard.fn";
import { ClientesComponent } from "src/app/modules/clientes/pages/clientes/clientes.component";
import { FacturaComponent } from "src/app/modules/clientes/pages/factura/factura.component";
import { LopdComponent } from "src/app/modules/clientes/pages/lopd/lopd.component";

const routes: Routes = [
  {
    path: "",
    component: ClientesComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: ":new",
    component: ClientesComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "lopd/:id",
    component: LopdComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "factura/:id",
    component: FacturaComponent,
    data: { type: "print" },
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "factura/:id/preview",
    component: FacturaComponent,
    data: { type: "preview" },
    canActivate: [isOpenedGuardFn],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientesRoutingModule {}
