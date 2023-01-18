/*
 * Páginas
 */
import { AlmacenComponent } from "src/app/pages/almacen/almacen.component";
import { ArticulosComponent } from "src/app/pages/articulos/articulos.component";
import { CajaComponent } from "src/app/pages/caja/caja.component";
import { ClientesComponent } from "src/app/pages/clientes/clientes.component";
import { ComprasComponent } from "src/app/pages/compras/compras/compras.component";
import { PedidoComponent } from "src/app/pages/compras/pedido/pedido.component";
import { FacturaComponent } from "src/app/pages/factura/factura.component";
import { GestionEmpleadosComponent } from "src/app/pages/gestion/gestion-empleados/gestion-empleados.component";
import { GestionMarcasComponent } from "src/app/pages/gestion/gestion-marcas/gestion-marcas.component";
import { GestionProveedoresComponent } from "src/app/pages/gestion/gestion-proveedores/gestion-proveedores.component";
import { GestionTiposPagoComponent } from "src/app/pages/gestion/gestion-tipos-pago/gestion-tipos-pago.component";
import { GestionComponent } from "src/app/pages/gestion/gestion/gestion.component";
import { InstallationComponent } from "src/app/pages/installation/installation.component";
import { InventarioPrintComponent } from "src/app/pages/inventario-print/inventario-print.component";
import { LopdComponent } from "src/app/pages/lopd/lopd.component";
import { MainComponent } from "src/app/pages/main/main.component";
import { VentasComponent } from "src/app/pages/ventas/ventas.component";

export const PAGES: any[] = [
  MainComponent,
  InstallationComponent,
  VentasComponent,
  ArticulosComponent,
  ComprasComponent,
  PedidoComponent,
  ClientesComponent,
  AlmacenComponent,
  GestionComponent,
  FacturaComponent,
  GestionEmpleadosComponent,
  GestionMarcasComponent,
  GestionProveedoresComponent,
  GestionTiposPagoComponent,
  LopdComponent,
  InventarioPrintComponent,
  CajaComponent,
];

/*
 * Componentes
 */
import { AlmacenInventarioComponent } from "src/app/components/almacen-inventario/almacen-inventario.component";
import { AlmacenListasComponent } from "src/app/components/almacen-listas/almacen-listas.component";
import { CajaModalComponent } from "src/app/components/caja-modal/caja-modal.component";
import { CierreCajaComponent } from "src/app/components/cierre-caja/cierre-caja.component";
import { AlertDialogComponent } from "src/app/components/dialogs/alert-dialog/alert-dialog.component";
import { ConfirmDialogComponent } from "src/app/components/dialogs/confirm-dialog/confirm-dialog.component";
import { FormDialogComponent } from "src/app/components/dialogs/form-dialog/form-dialog.component";
import { EmployeeLoginComponent } from "src/app/components/employee-login/employee-login.component";
import { HeaderComponent } from "src/app/components/header/header.component";
import { HistoricoVentasComponent } from "src/app/components/historico-ventas/historico-ventas.component";
import { SalidasCajaComponent } from "src/app/components/salidas-caja/salidas-caja.component";
import { TabsComponent } from "src/app/components/tabs/tabs.component";
import { UnaVentaComponent } from "src/app/components/una-venta/una-venta.component";
import { OverlayComponent } from "src/app/shared/overlay/overlay.component";

export const COMPONENTS: any[] = [
  ConfirmDialogComponent,
  AlertDialogComponent,
  FormDialogComponent,
  TabsComponent,
  UnaVentaComponent,
  HeaderComponent,
  EmployeeLoginComponent,
  CajaModalComponent,
  HistoricoVentasComponent,
  SalidasCajaComponent,
  CierreCajaComponent,
  AlmacenInventarioComponent,
  AlmacenListasComponent,
  OverlayComponent,
];

/*
 * Modales
 */
import { AccesosDirectosModalComponent } from "src/app/components/modals/accesos-directos-modal/accesos-directos-modal.component";
import { ArticuloDarDeBajaModalComponent } from "src/app/components/modals/articulo-dar-de-baja-modal/articulo-dar-de-baja-modal.component";
import { BuscadorModalComponent } from "src/app/components/modals/buscador-modal/buscador-modal.component";
import { DevolucionModalComponent } from "src/app/components/modals/devolucion-modal/devolucion-modal.component";
import { EditFacturaModalComponent } from "src/app/components/modals/edit-factura-modal/edit-factura-modal.component";
import { ElegirClienteModalComponent } from "src/app/components/modals/elegir-cliente-modal/elegir-cliente-modal.component";
import { EmployeeLoginModalComponent } from "src/app/components/modals/employee-login-modal/employee-login-modal.component";
import { MargenesModalComponent } from "src/app/components/modals/margenes-modal/margenes-modal.component";
import { NewMarcaModalComponent } from "src/app/components/modals/new-marca-modal/new-marca-modal.component";
import { NewProveedorModalComponent } from "src/app/components/modals/new-proveedor-modal/new-proveedor-modal.component";
import { VentaAccesosDirectosModalComponent } from "src/app/components/modals/venta-accesos-directos-modal/venta-accesos-directos-modal.component";
import { VentaDescuentoModalComponent } from "src/app/components/modals/venta-descuento-modal/venta-descuento-modal.component";
import { VentaFinalizarModalComponent } from "src/app/components/modals/venta-finalizar-modal/venta-finalizar-modal.component";
import { VentaVariosModalComponent } from "src/app/components/modals/venta-varios-modal/venta-varios-modal.component";

export const MODALS: any[] = [
  AccesosDirectosModalComponent,
  MargenesModalComponent,
  BuscadorModalComponent,
  DevolucionModalComponent,
  NewMarcaModalComponent,
  NewProveedorModalComponent,
  ArticuloDarDeBajaModalComponent,
  VentaDescuentoModalComponent,
  VentaVariosModalComponent,
  EmployeeLoginModalComponent,
  EditFacturaModalComponent,
  ElegirClienteModalComponent,
  VentaAccesosDirectosModalComponent,
  VentaFinalizarModalComponent,
];

/*
 * Pipes
 */
import { BrandListFilterPipe } from "src/app/pipes/brand-list-filter.pipe";
import { ClientListFilterPipe } from "src/app/pipes/client-list-filter.pipe";
import { EmployeeListFilterPipe } from "src/app/pipes/employee-list-filter.pipe";
import { FixedNumberPipe } from "src/app/pipes/fixed-number.pipe";
import { PayTypeListFilterPipe } from "src/app/pipes/pay-type-list-filter.pipe";
import { ProviderBrandListFilterPipe } from "src/app/pipes/provider-brand-list-filter.pipe";
import { ProviderListFilterPipe } from "src/app/pipes/provider-list-filter.pipe";

export const PIPES: any[] = [
  FixedNumberPipe,
  ClientListFilterPipe,
  EmployeeListFilterPipe,
  BrandListFilterPipe,
  ProviderListFilterPipe,
  ProviderBrandListFilterPipe,
  PayTypeListFilterPipe,
];

/*
 * Servicios
 */
import { ApiService } from "src/app/services/api.service";
import { ArticulosService } from "src/app/services/articulos.service";
import { CategoriasService } from "src/app/services/categorias.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ClientesService } from "src/app/services/clientes.service";
import { ComprasService } from "src/app/services/compras.service";
import { ConfigService } from "src/app/services/config.service";
import { DialogService } from "src/app/services/dialog.service";
import { EmpleadosService } from "src/app/services/empleados.service";
import { GestionService } from "src/app/services/gestion.service";
import { MarcasService } from "src/app/services/marcas.service";
import { OverlayService } from "src/app/services/overlay.service";
import { ProveedoresService } from "src/app/services/proveedores.service";
import { VentasService } from "src/app/services/ventas.service";

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
  GestionService,
  ComprasService,
  OverlayService,
];

/*
 * Componentes Angular Material
 */
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";

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
  MatTableModule,
  DragDropModule,
  MatNativeDateModule,
  MatPaginatorModule,
];
