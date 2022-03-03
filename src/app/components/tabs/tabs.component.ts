import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MatTabGroup }   from '@angular/material/tabs';
import { Tabs }          from 'src/app/interfaces/interfaces';
import { DialogService } from 'src/app/services/dialog.service';

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

	constructor(private dialog: DialogService) {}
	
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
		setTimeout(() => {
			this.elegirClienteBoxName.nativeElement.focus();
		}, 0);
	}
	
	cerrarElegirCliente(ev: MouseEvent = null): void {
		ev && ev.preventDefault();
		this.mostrarElegirCliente = false;
	}
	
	searchStart(): void {
		
	}
}
