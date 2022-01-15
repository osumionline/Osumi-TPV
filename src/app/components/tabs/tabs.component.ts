import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Tabs }          from '../../interfaces/interfaces';
import { DialogService } from '../../services/dialog.service';

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

	constructor(private dialog: DialogService) {}

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
}
