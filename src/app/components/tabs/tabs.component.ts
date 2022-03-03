import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MatTabGroup }        from '@angular/material/tabs';
import { ConfigService }      from 'src/app/services/config.service';
import { DialogService }      from 'src/app/services/dialog.service';
import { ApiService }         from 'src/app/services/api.service';
import { ClassMapperService } from 'src/app/services/class-mapper.service';
import { Cliente }            from 'src/app/model/cliente.model';
import {
	Tabs,
	ProvinceInterface
} from 'src/app/interfaces/interfaces';

@Component({
	selector: 'otpv-tabs',
	templateUrl: './tabs.component.html',
	styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {
	@Input() tabs: Tabs = {
		selected: 0,
		names: []
	};
	@Input() showClose: boolean = false;
	@Output() closeTabEvent = new EventEmitter<number>();
	@Output() newTabEvent = new EventEmitter<number>();
	@Output() changeTabEvent = new EventEmitter<number>();
	
	mostrarElegirCliente: boolean = false;
	@ViewChild('elegirClienteTabs', {static: false}) elegirClienteTabs: MatTabGroup;
	elegirClienteNombre: string = '';
	@ViewChild('elegirClienteBoxName', { static: true }) elegirClienteBoxName: ElementRef;
	searchTimer: number = null;
	searching: boolean = false;
	searched: boolean = false;
	searchResult: Cliente[] = [];
	
	nuevoCliente: Cliente = new Cliente();
	provincias: ProvinceInterface[] = [];

	constructor(
		public config: ConfigService,
		private dialog: DialogService,
		private as: ApiService,
		private cms: ClassMapperService
	) {}
	
	@HostListener('window:keydown', ['$event'])
	onKeyDown(ev: KeyboardEvent) {
		if (ev.key === 'Escape') {
			if (this.mostrarElegirCliente) {
				this.cerrarElegirCliente();
			}
		}
	}

	selectTab(ind: number): void {
		this.tabs.selected = ind;
		this.changeTabEvent.emit(ind);
	}

	closeTab(ind: number): void {
		this.dialog.confirm({title: 'Confirmar', content: '¿Estás seguro de querer cerrar esta venta?', ok: 'Continuar', cancel: 'Cancelar'}).subscribe(result => {
			if (result===true) {
				this.closeTabEvent.emit(ind);
			}
		});
	}

	newTab(): void {
		this.newTabEvent.emit(0);
	}

	selectClient(): void {
		this.mostrarElegirCliente = true;
		this.elegirClienteTabs.realignInkBar();
		this.elegirClienteNombre = '';
		this.searching = false;
		this.searched = false;
		this.nuevoCliente = new Cliente();
		setTimeout(() => {
			this.elegirClienteBoxName.nativeElement.focus();
		}, 0);
	}

	cerrarElegirCliente(ev: MouseEvent = null): void {
		ev && ev.preventDefault();
		this.mostrarElegirCliente = false;
	}

	searchStart(): void {
		clearTimeout(this.searchTimer);
		this.searchTimer = window.setTimeout(() => {this.searchClientes();}, 500);
	}

	searchClientes(): void {
		if (this.searching) {
			return;
		}
		this.searchResult = [];
		if (this.elegirClienteNombre === null || this.elegirClienteNombre === '') {
			return;
		}
		this.searching = true;
		this.as.searchClientes(this.elegirClienteNombre).subscribe(result => {
			this.searching = false;
			this.searched = true;
			if (result.status === 'ok') {
				this.searchResult = this.cms.getClientes(result.list);
			}
			else {
				this.dialog.alert({title: 'Error', content: 'Ocurrió un error al buscar los clientes.', ok: 'Continuar'}).subscribe(result => {});
			}
		});
	}
}
