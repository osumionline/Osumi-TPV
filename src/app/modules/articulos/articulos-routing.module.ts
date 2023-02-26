import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { isOpenedGuardFn } from "src/app/guard/opened.guard.fn";
import { ArticulosComponent } from "src/app/modules/articulos/pages/articulos/articulos.component";

const routes: Routes = [
  {
    path: "",
    component: ArticulosComponent,
    canActivate: [isOpenedGuardFn],
  },
  {
    path: ":localizador",
    component: ArticulosComponent,
    canActivate: [isOpenedGuardFn],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticulosRoutingModule {}
