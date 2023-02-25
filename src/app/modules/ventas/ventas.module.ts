import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "src/app/modules/material/material.module";
import { VentasRoutingModule } from "./ventas-routing.module";

import { VentasComponent } from "./pages/ventas/ventas.component";

import { UnaVentaComponent } from "./components/una-venta/una-venta.component";
import { VentasTabsComponent } from "./components/ventas-tabs/ventas-tabs.component";

import { DevolucionModalComponent } from "src/app/modules/ventas/components/modals/devolucion-modal/devolucion-modal.component";
import { ElegirClienteModalComponent } from "src/app/modules/ventas/components/modals/elegir-cliente-modal/elegir-cliente-modal.component";
import { ReservasModalComponent } from "src/app/modules/ventas/components/modals/reservas-modal/reservas-modal.component";
import { VentaAccesosDirectosModalComponent } from "src/app/modules/ventas/components/modals/venta-accesos-directos-modal/venta-accesos-directos-modal.component";
import { VentaDescuentoModalComponent } from "src/app/modules/ventas/components/modals/venta-descuento-modal/venta-descuento-modal.component";
import { VentaFinalizarModalComponent } from "src/app/modules/ventas/components/modals/venta-finalizar-modal/venta-finalizar-modal.component";
import { VentaVariosModalComponent } from "src/app/modules/ventas/components/modals/venta-varios-modal/venta-varios-modal.component";

import { EmployeeLoginComponent } from "src/app/modules/standalone/components/employee-login/employee-login.component";
import { HeaderComponent } from "src/app/modules/standalone/components/header/header.component";
import { FixedNumberPipe } from "src/app/modules/standalone/pipes/fixed-number.pipe";

@NgModule({
  declarations: [
    VentasComponent,
    UnaVentaComponent,
    VentasTabsComponent,
    DevolucionModalComponent,
    ElegirClienteModalComponent,
    ReservasModalComponent,
    VentaAccesosDirectosModalComponent,
    VentaDescuentoModalComponent,
    VentaFinalizarModalComponent,
    VentaVariosModalComponent,
  ],
  imports: [
    VentasRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HeaderComponent,
    EmployeeLoginComponent,
    FixedNumberPipe,
  ],
})
export class VentasModule {}
