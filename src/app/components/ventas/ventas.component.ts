import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ConfigService }     from 'src/app/services/config.service';
import { UnaVentaComponent } from 'src/app/components/una-venta/una-venta.component';
import { TipoPago }          from 'src/app/model/tipo-pago.model';
import { VentasService }     from 'src/app/services/ventas.service';

@Component({
	selector: 'otpv-ventas',
	templateUrl: './ventas.component.html',
	styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {
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

	constructor(public config: ConfigService, public ventas: VentasService) {}

	ngOnInit(): void {
		this.ventas.newVenta();
		this.startFocus();
	}

	startFocus(): void {
		this.venta.setFocus();
	}

	cerrarVenta(ind: number): void {
		if (this.ventas.tabs.selected===ind) {
			this.ventas.tabs.selected = 0;
		}
		this.ventas.tabs.names.splice(ind, 1);
		this.ventas.list.splice(ind, 1);
	}

	deleteVentaLinea(ind: number): void {
		this.ventas.list[this.ventas.tabs.selected].lineas.splice(ind, 1);
		this.venta.venta.updateImporte();
		this.startFocus();
	}

	showDetails(loc: number): void {
		this.showDetailsEvent.emit(loc);
	}

	endVenta(id: number): void {
		const ind = this.ventas.list.findIndex(x => x.id === id);
		this.fin.total = this.ventas.list[ind].importe;

		const tipoPago: TipoPago = this.config.tiposPago[0];
		this.fin.tipoPago = tipoPago.id;
		this.fin.lineas = this.ventas.list[ind].lineas.filter(x => x.idArticulo !== null);
		this.showFinalizarVenta = true;
	}

	cerrarFinalizarVenta(): void {
		this.showFinalizarVenta = false;
	}
}
