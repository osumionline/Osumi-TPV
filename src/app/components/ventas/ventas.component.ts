import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Tabs }              from 'src/app/interfaces/interfaces';
import { UnaVentaComponent } from 'src/app/components/una-venta/una-venta.component';
import { Venta }             from 'src/app/model/venta.model';

@Component({
	selector: 'otpv-ventas',
	templateUrl: './ventas.component.html',
	styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {
	tabs: Tabs = {
		selected: 0,
		names: []
	};
	ventas: Venta[] = [];

	@ViewChild('venta', { static: true }) venta: UnaVentaComponent;
	@Output() showDetailsEvent = new EventEmitter<number>();

	constructor() {}
	ngOnInit(): void {
		this.newVenta();
	}

	startFocus(): void {
		this.venta.setFocus();
	}

	cerrarVenta(ind: number): void {
		if (this.tabs.selected===ind) {
			this.tabs.selected = 0;
		}
		this.tabs.names.splice(ind, 1);
		this.ventas.splice(ind, 1);
	}

	newVenta(): void {
		this.tabs.names.push('VENTA ' + (this.tabs.names.length + 1));
		this.tabs.selected = (this.tabs.names.length - 1);
		this.ventas.push(new Venta());

		setTimeout(() => {
			this.venta.addLineaVenta();
		}, 200);
	}

	deleteVentaLinea(ind: number): void {
		this.ventas[this.tabs.selected].lineas.splice(ind, 1);
		this.venta.updateImporte();
		this.startFocus();
	}

	showDetails(loc: number): void {
		this.showDetailsEvent.emit(loc);
	}
}
