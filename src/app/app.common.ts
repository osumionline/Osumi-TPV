/*
 * Páginas
 */
import { MainComponent }         from './pages/main/main.component';
import { InstallationComponent } from './pages/installation/installation.component';

export const PAGES: any[] = [
	MainComponent,
	InstallationComponent
];

/*
 * Componentes
 */
import { ConfirmDialogComponent } from './components/dialogs/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent }   from './components/dialogs/alert-dialog/alert-dialog.component';
import { FormDialogComponent }    from './components/dialogs/form-dialog/form-dialog.component';
import { VentasComponent }        from './components/ventas/ventas.component';
import { ArticulosComponent }     from './components/articulos/articulos.component';
import { PedidosComponent }       from './components/pedidos/pedidos.component';
import { TabsComponent }          from './components/tabs/tabs.component';
import { UnaVentaComponent }      from './components/una-venta/una-venta.component';

export const COMPONENTS: any[] = [
	ConfirmDialogComponent,
	AlertDialogComponent,
	FormDialogComponent,
	VentasComponent,
	ArticulosComponent,
	PedidosComponent,
	TabsComponent,
	UnaVentaComponent
];

/*
 * Pipes
 */
import { UrldecodePipe }   from './pipes/urldecode.pipe';
import { FixedNumberPipe } from './pipes/fixed-number.pipe';

export const PIPES: any[] = [
	UrldecodePipe,
	FixedNumberPipe
];

/*
 * Servicios
 */
import { ConfigService }      from './services/config.service';
import { CommonService }      from './services/common.service';
import { ApiService }         from './services/api.service';
import { DataShareService }   from './services/data-share.service';
import { DialogService }      from './services/dialog.service';
import { CategoriasService }  from './services/categorias.service';
import { ClassMapperService } from './services/class-mapper.service';
import { MarcasService }      from './services/marcas.service';
import { ProveedoresService } from './services//proveedores.service';

export const SERVICES: any[] = [
	ConfigService,
	CommonService,
	ApiService,
	DataShareService,
	DialogService,
	CategoriasService,
	ClassMapperService,
	MarcasService,
	ProveedoresService
];

/*
 * Componentes Angular Material
 */
import { MatToolbarModule }     from '@angular/material/toolbar';
import { MatCardModule }        from '@angular/material/card';
import { MatButtonModule }      from '@angular/material/button';
import { MatFormFieldModule }   from '@angular/material/form-field';
import { MatInputModule }       from '@angular/material/input';
import { MatIconModule }        from '@angular/material/icon';
import { MatListModule }        from '@angular/material/list';
import { MatSidenavModule }     from '@angular/material/sidenav';
import { MatDialogModule }      from '@angular/material/dialog';
import { MatSelectModule }      from '@angular/material/select';
import { MatTabsModule }        from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule }    from '@angular/material/checkbox';
import { MatRadioModule }       from '@angular/material/radio';
import { MatDatepickerModule }  from '@angular/material/datepicker';

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
	MatDatepickerModule
];
