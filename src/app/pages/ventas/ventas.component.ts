import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router }            from '@angular/router';
import { ConfigService }     from 'src/app/services/config.service';
import { UnaVentaComponent } from 'src/app/components/una-venta/una-venta.component';
import { VentasService }     from 'src/app/services/ventas.service';
import { ClientesService }   from 'src/app/services/clientes.service';

@Component({
	selector: 'otpv-ventas',
	templateUrl: './ventas.component.html',
	styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {
	@ViewChild('venta', { static: true }) venta: UnaVentaComponent;
	showFinalizarVenta: boolean = false;

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
		this.showFinalizarVenta = true;
	}

	cerrarFinalizarVenta(): void {
		this.showFinalizarVenta = false;
	}
}
