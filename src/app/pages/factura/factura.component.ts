import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router} from '@angular/router';
import { ConfigService }     from 'src/app/services/config.service';
import { VentasService }     from 'src/app/services/ventas.service';

@Component({
	selector: 'otpv-factura',
	templateUrl: './factura.component.html',
	styleUrls: ['./factura.component.scss']
})
export class FacturaComponent implements OnInit {
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private config: ConfigService,
		private vs: VentasService
	) {}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe((params: Params) => {
			const id: number = params.id;

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
					this.loadVenta(id);
				}
			});
		});
	}

	loadVenta(id: number): void {
		this.vs.getVenta(id).subscribe(result  => {
			console.log(result);
		});
	}
}
