import { Component, OnInit, ViewChild } from '@angular/core';
import { Router }             from '@angular/router';
import { ApiService }         from 'src/app/services/api.service';
import { ConfigService }      from 'src/app/services/config.service';
import { DataShareService }   from 'src/app/services/data-share.service';
import { VentasComponent }    from 'src/app/components/ventas/ventas.component';
import { ArticulosComponent } from 'src/app/components/articulos/articulos.component';
import { PedidosComponent }   from 'src/app/components/pedidos/pedidos.component';
import { environment }        from 'src/environments/environment';

@Component({
	selector: 'otpv-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
	title: string = environment.name;

	@ViewChild('ventas') ventasComponent:    VentasComponent;
	@ViewChild('articulos') articulosComponent: ArticulosComponent;
	@ViewChild('pedidos') pedidosComponent:   PedidosComponent;

	loading: boolean = true;
	selectedOption: string = 'sales';
	isOpened: boolean = false;

	constructor(
		private as: ApiService,
		private config: ConfigService,
		private router: Router,
		private dss: DataShareService
	) {}

	ngOnInit(): void {
		const d: Date = new Date();
		const date = d.getFullYear() + '-' + (((d.getMonth()+1)<10) ? '0'+(d.getMonth()+1) : (d.getMonth()+1)) + '-' + ((d.getDate()<10) ? '0'+d.getDate() : d.getDate());
		this.as.checkStart(date).subscribe(result => {
			if (result.appData===null) {
				this.router.navigate(['/installation']);
			}
			else {
				this.config.load(result.appData);
				this.isOpened = result.opened;
				this.articulosComponent.loadAppData();
			}
			this.loading = false;
		});
	}

	openBox(): void {
		this.as.openBox().subscribe(result => {
			this.isOpened = true;
			this.ventasComponent.startFocus();
		});
	}

	selectOptionSales(): void {
		this.selectOption('sales');
		this.ventasComponent.startFocus();
	}

	selectOptionItems(): void {
		this.articulosComponent.newArticulo();
		this.selectOption('items');
	}

	selectOptionOrders(): void {
		this.selectOption('orders');
	}

	selectOption(option: string): void {
		this.selectedOption = option;
	}

	showDetails(loc: number): void {
		this.articulosComponent.showDetails(loc);
		this.selectedOption = 'items';
	}
}
