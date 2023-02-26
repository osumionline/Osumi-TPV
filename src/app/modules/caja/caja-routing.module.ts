import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { isOpenedGuardFn } from "src/app/guard/opened.guard.fn";
import { CajaComponent } from "src/app/modules/caja/pages/caja/caja.component";
import { InformeDetalladoComponent } from "src/app/modules/caja/pages/informe-detallado/informe-detallado.component";
import { InformeSimpleComponent } from "src/app/modules/caja/pages/informe-simple/informe-simple.component";

const routes: Routes = [
  {
    path: "",
    component: CajaComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "informes/detallado/:year/:month",
    component: InformeDetalladoComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: "informes/simple/:year/:month",
    component: InformeSimpleComponent,
    canActivate: [isOpenedGuardFn],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CajaRoutingModule {}
