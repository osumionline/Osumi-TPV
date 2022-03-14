import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { Router }            from '@angular/router';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelect }         from '@angular/material/select';
import { ConfigService }     from 'src/app/services/config.service';
import { UnaVentaComponent } from 'src/app/components/una-venta/una-venta.component';
import { VentasService }     from 'src/app/services/ventas.service';
import { ClientesService }   from 'src/app/services/clientes.service';
import { Utils }             from 'src/app/model/utils.class';

@Component({
	selector: 'otpv-ventas',
	templateUrl: './ventas.component.html',
	styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {
	@ViewChild('venta', { static: true }) venta: UnaVentaComponent;
	showFinalizarVenta: boolean = false;
	@ViewChild('efectivoValue', { static: true }) efectivoValue: ElementRef;
	@ViewChild('tarjetaValue', { static: true }) tarjetaValue: ElementRef;
	@ViewChild('clientesValue', { static: true }) clientesValue: MatSelect;

	constructor(
		private router: Router,
		public config: ConfigService,
		public vs: VentasService,
		public cs: ClientesService
	) {}

	ngOnInit(): void {
		this.config.start().then((status) => {
			if (status === 'install') {
				this.router.navigate(['/installation']);
				return;
			}
			if (status === 'loaded') {
				if (!this.config.isOpened) {
					this.router.navigate(['/']);
					return;
				}
			}
		});
		if (this.vs.tabs.selected === -1) {
			this.newVenta();
		}
		else {
			this.startFocus();
		}
	}

	@HostListener('window:keydown', ['$event'])
	onKeyDown(ev: KeyboardEvent) {
		if (ev.key === 'Escape') {
			if (this.showFinalizarVenta) {
				this.cerrarFinalizarVenta();
			}
		}
	}

	newVenta(): void {
		this.vs.newVenta();
		this.startFocus();
	}

	startFocus(): void {
		this.venta.setFocus();
	}

	cerrarVenta(ind: number): void {
		if (this.vs.tabs.selected===ind) {
			this.vs.tabs.selected = 0;
		}
		this.vs.tabs.names.splice(ind, 1);
		this.vs.list.splice(ind, 1);
	}

	deleteVentaLinea(ind: number): void {
		this.vs.list[this.vs.tabs.selected].lineas.splice(ind, 1);
		this.venta.venta.updateImporte();
		this.startFocus();
	}

	selectClient(id: number): void {
		this.startFocus();
	}

	endVenta(id: number): void {
		this.vs.loadFinVenta();
		this.cs.load();
		this.showFinalizarVenta = true;
		setTimeout(() => {
			this.efectivoValue.nativeElement.select();
		}, 0);
	}

	cerrarFinalizarVenta(): void {
		this.showFinalizarVenta = false;
		this.venta.setFocus();
	}

	updateCambio(): void {
		const cambio: string = Utils.formatNumber(Utils.toNumber(this.vs.fin.efectivo) - Utils.toNumber(this.vs.fin.total));
		if (Utils.toNumber(cambio)  > 0) {
			this.vs.fin.cambio = cambio;
		}
	}

	updateEfectivoMixto(): void {
		if (Utils.toNumber(this.vs.fin.tarjeta) === 0) {
			this.vs.fin.efectivo  = '0';
			this.vs.fin.cambio = '0';
			return;
		}
		const efectivo: string = Utils.formatNumber(Utils.toNumber(this.vs.fin.total) - Utils.toNumber(this.vs.fin.tarjeta));
		if (Utils.toNumber(efectivo) > 0) {
			this.vs.fin.efectivo = efectivo;
			this.vs.fin.cambio = '0';
		}
		else {
			this.vs.fin.efectivo  = '0';
			this.vs.fin.cambio = Utils.formatNumber(Utils.toNumber(efectivo) * -1);
		}
	}

	selectTipoPago(id: number): void {
		if (this.vs.fin.idTipoPago === id) {
			this.vs.fin.idTipoPago = null;
			this.vs.fin.efectivo = this.vs.fin.total;
			setTimeout(() => {
				this.efectivoValue.nativeElement.select();
			}, 0);
		}
		else {
			this.vs.fin.idTipoPago = id;
			if (this.vs.fin.pagoMixto) {
				this.updateEfectivoMixto();
				setTimeout(() => {
					this.tarjetaValue.nativeElement.select();
				}, 0);
			}
			else {
				this.vs.fin.efectivo = '0';
				this.vs.fin.cambio = '0';
			}
		}
	}

	changePagoMixto(ev: MatCheckboxChange): void {
		if (ev.checked) {
			setTimeout(() => {
				this.tarjetaValue.nativeElement.select();
			}, 0);
		}
		else {
			if (this.vs.fin.idTipoPago === null) {
				this.vs.fin.efectivo = '0';
				this.vs.fin.tarjeta = '0';
				setTimeout(() => {
					this.efectivoValue.nativeElement.select();
				}, 0);
			}
			else {
				this.vs.fin.tarjeta = '0';
			}
		}
	}

	changeFactura(ev: MatCheckboxChange): void {
		if (ev.checked) {
			setTimeout(() => {
				this.clientesValue.toggle();
			}, 0);
		}
		else {
			if (this.vs.fin.pagoMixto) {
				setTimeout(() => {
					this.tarjetaValue.nativeElement.select();
				}, 0);
			}
			else {
				if (this.vs.fin.idTipoPago === null) {
					setTimeout(() => {
						this.efectivoValue.nativeElement.select();
					}, 0);
				}
			}
		}
	}
}
