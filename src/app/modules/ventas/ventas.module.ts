import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "src/app/modules/material/material.module";
import { VentasRoutingModule } from "./ventas-routing.module";

import { VentasComponent } from "./pages/ventas/ventas.component";

import { UnaVentaComponent } from "./components/una-venta/una-venta.component";
import { VentasTabsComponent } from "./components/ventas-tabs/ventas-tabs.component";

import { EmployeeLoginComponent } from "src/app/modules/standalone/components/employee-login/employee-login.component";
import { HeaderComponent } from "src/app/modules/standalone/components/header/header.component";
import { FixedNumberPipe } from "src/app/modules/standalone/pipes/fixed-number.pipe";

@NgModule({
  declarations: [VentasComponent, UnaVentaComponent, VentasTabsComponent],
  imports: [
    VentasRoutingModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    HeaderComponent,
    EmployeeLoginComponent,
    FixedNumberPipe,
  ],
})
export class VentasModule {}
