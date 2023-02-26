/*
 * Páginas
 */
import { AlmacenComponent } from "src/app/pages/almacen/almacen.component";
import { CajaComponent } from "src/app/pages/caja/caja.component";
import { BackupComponent } from "src/app/pages/gestion/backup/backup.component";
import { GestionEmpleadosComponent } from "src/app/pages/gestion/gestion-empleados/gestion-empleados.component";
import { GestionTiposPagoComponent } from "src/app/pages/gestion/gestion-tipos-pago/gestion-tipos-pago.component";
import { GestionComponent } from "src/app/pages/gestion/gestion/gestion.component";
import { InformeDetalladoComponent } from "src/app/pages/informes/informe-detallado/informe-detallado.component";
import { InformeSimpleComponent } from "src/app/pages/informes/informe-simple/informe-simple.component";
import { InstallationComponent } from "src/app/pages/installation/installation.component";
import { InventarioPrintComponent } from "src/app/pages/inventario-print/inventario-print.component";
import { MainComponent } from "src/app/pages/main/main.component";

export const PAGES: any[] = [
  MainComponent,
  InstallationComponent,
  AlmacenComponent,
  GestionComponent,
  GestionEmpleadosComponent,
  GestionTiposPagoComponent,
  InventarioPrintComponent,
  CajaComponent,
  InformeDetalladoComponent,
  InformeSimpleComponent,
  BackupComponent,
];

/*
 * Componentes
 */
import { AlmacenInventarioComponent } from "src/app/components/almacen/almacen-inventario/almacen-inventario.component";
import { AlmacenListasComponent } from "src/app/components/almacen/almacen-listas/almacen-listas.component";
import { ImprentaTableComponent } from "src/app/components/almacen/imprenta-table/imprenta-table.component";
import { ImprentaComponent } from "src/app/components/almacen/imprenta/imprenta.component";
import { AlertDialogComponent } from "src/app/components/dialogs/alert-dialog/alert-dialog.component";
import { ConfirmDialogComponent } from "src/app/components/dialogs/confirm-dialog/confirm-dialog.component";
import { FormDialogComponent } from "src/app/components/dialogs/form-dialog/form-dialog.component";
import { CajaModalComponent } from "src/app/components/modals/caja-modal/caja-modal.component";
import { OverlayComponent } from "src/app/shared/overlay/overlay.component";

export const COMPONENTS: any[] = [
  ConfirmDialogComponent,
  AlertDialogComponent,
  FormDialogComponent,
  CajaModalComponent,
  AlmacenInventarioComponent,
  AlmacenListasComponent,
  OverlayComponent,
  ImprentaComponent,
  ImprentaTableComponent,
];

/*
 * Pipes
 */
import { EmployeeListFilterPipe } from "src/app/pipes/employee-list-filter.pipe";
import { PayTypeListFilterPipe } from "src/app/pipes/pay-type-list-filter.pipe";

export const PIPES: any[] = [EmployeeListFilterPipe, PayTypeListFilterPipe];

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
import { InformesService } from "src/app/services/informes.service";
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
  InformesService,
];
