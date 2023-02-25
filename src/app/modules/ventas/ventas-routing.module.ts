import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { isOpenedGuardFn } from "src/app/guard/opened.guard.fn";
import { VentasComponent } from "./pages/ventas/ventas.component";

const routes: Routes = [
  {
    path: "",
    component: VentasComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: ":id",
    component: VentasComponent,
    canActivate: [isOpenedGuardFn],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VentasRoutingModule {}
