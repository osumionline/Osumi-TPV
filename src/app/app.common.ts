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

export const COMPONENTS: any[] = [
	ConfirmDialogComponent,
	AlertDialogComponent,
	FormDialogComponent,
	VentasComponent,
	ArticulosComponent,
	PedidosComponent
];

/*
 * Pipes
 */
import { UrldecodePipe }  from './pipes/urldecode.pipe';

export const PIPES: any[] = [
	UrldecodePipe
];

/*
 * Servicios
 */
import { CommonService }    from './services/common.service';
import { ApiService }       from './services/api.service';
import { DataShareService } from './services/data-share.service';
import { DialogService }    from './services/dialog.service';

export const SERVICES: any[] = [
	CommonService,
	ApiService,
	DataShareService,
	DialogService
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
	MatRadioModule
];