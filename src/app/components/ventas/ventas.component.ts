import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ConfigService }     from 'src/app/services/config.service';
import { Tabs }              from 'src/app/interfaces/interfaces';
import { UnaVentaComponent } from 'src/app/components/una-venta/una-venta.component';
import { Venta }             from 'src/app/model/venta.model';
import { TipoPago }          from 'src/app/model/tipo-pago.model';

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

	showFinalizarVenta: boolean = false;

	fin = {
		efectivo: 0,
		cambio: 0,
		tarjeta: 0,
		tipoPago: null,
		total: 0,
		lineas: []
	};

	constructor(public config: ConfigService) {}

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
		this.venta.venta.updateImporte();
		this.startFocus();
	}

	showDetails(loc: number): void {
		this.showDetailsEvent.emit(loc);
	}

	endVenta(id: number): void {
		const ind = this.ventas.findIndex(x => x.id === id);
		this.fin.total = this.ventas[ind].importe;

		const tipoPago: TipoPago = this.config.tiposPago[0];
		this.fin.tipoPago = tipoPago.id;
		this.fin.lineas = this.ventas[ind].lineas.filter(x => x.idArticulo !== null);
		this.showFinalizarVenta = true;
	}

	cerrarFinalizarVenta(): void {
		this.showFinalizarVenta = false;
	}
}
