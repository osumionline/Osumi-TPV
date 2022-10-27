/*
 * Páginas
 */
import { MainComponent } from "src/app/pages/main/main.component";
import { InstallationComponent } from "src/app/pages/installation/installation.component";
import { VentasComponent } from "src/app/pages/ventas/ventas.component";
import { ArticulosComponent } from "src/app/pages/articulos/articulos.component";
import { PedidosComponent } from "src/app/pages/pedidos/pedidos.component";
import { ClientesComponent } from "src/app/pages/clientes/clientes.component";
import { AlmacenComponent } from "src/app/pages/almacen/almacen.component";
import { GestionComponent } from "src/app/pages/gestion/gestion.component";
import { FacturaComponent } from "src/app/pages/factura/factura.component";

export const PAGES: any[] = [
  MainComponent,
  InstallationComponent,
  VentasComponent,
  ArticulosComponent,
  PedidosComponent,
  ClientesComponent,
  AlmacenComponent,
  GestionComponent,
  FacturaComponent,
];

/*
 * Componentes
 */
import { ConfirmDialogComponent } from "src/app/components/dialogs/confirm-dialog/confirm-dialog.component";
import { AlertDialogComponent } from "src/app/components/dialogs/alert-dialog/alert-dialog.component";
import { FormDialogComponent } from "src/app/components/dialogs/form-dialog/form-dialog.component";
import { TabsComponent } from "src/app/components/tabs/tabs.component";
import { UnaVentaComponent } from "src/app/components/una-venta/una-venta.component";
import { HeaderComponent } from "src/app/components/header/header.component";

export const COMPONENTS: any[] = [
  ConfirmDialogComponent,
  AlertDialogComponent,
  FormDialogComponent,
  TabsComponent,
  UnaVentaComponent,
  HeaderComponent,
];

/*
 * Pipes
 */
import { FixedNumberPipe } from "src/app/pipes/fixed-number.pipe";
import { ClientListFilterPipe } from "src/app/pipes/client-list-filter.pipe";

export const PIPES: any[] = [FixedNumberPipe, ClientListFilterPipe];

/*
 * Servicios
 */
import { ConfigService } from "src/app/services/config.service";
import { ApiService } from "src/app/services/api.service";
import { DialogService } from "src/app/services/dialog.service";
import { CategoriasService } from "src/app/services/categorias.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { MarcasService } from "src/app/services/marcas.service";
import { ProveedoresService } from "src/app/services/proveedores.service";
import { VentasService } from "src/app/services/ventas.service";
import { ArticulosService } from "src/app/services/articulos.service";
import { ClientesService } from "src/app/services/clientes.service";
import { EmpleadosService } from "src/app/services/empleados.service";

export const SERVICES: any[] = [
  ConfigService,
  ApiService,
  DialogService,
  CategoriasService,
  ClassMapperService,
  MarcasService,
  ProveedoresService,
  VentasService,
  ArticulosService,
  ClientesService,
  EmpleadosService,
];

/*
 * Componentes Angular Material
 */
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { MatDatepickerModule } from "@angular/material/datepicker";

export const MATERIAL: any[] = [
  MatToolbarModule,
  MatCardModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatListModule,
  MatSidenavModule,
  MatDialogModule,
  MatSelectModule,
  MatTabsModule,
  MatSlideToggleModule,
  MatCheckboxModule,
  MatRadioModule,
  MatDatepickerModule,
];
