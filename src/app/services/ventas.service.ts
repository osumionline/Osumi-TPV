import { Injectable } from '@angular/core';
import { Tabs }       from 'src/app/interfaces/interfaces';
import { Venta }      from 'src/app/model/venta.model';
import { LineaVenta } from 'src/app/model/lineaventa.model';

@Injectable({
	providedIn: 'root'
})
export class VentasService {
	tabs: Tabs = {
		selected: 0,
		names: []
	};
	list: Venta[] = [];

	constructor() {}

	newVenta(): void {
		this.tabs.names.push('VENTA ' + (this.tabs.names.length + 1));
		this.tabs.selected = (this.tabs.names.length - 1);
		this.list.push(new Venta());

		this.addLineaVenta();
	}

	addLineaVenta(): void {
		this.list[this.tabs.selected].lineas.push(new LineaVenta());
	}
}
