import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApiService }         from 'src/app/services/api.service';
import { DialogService }      from 'src/app/services/dialog.service';
import { ClassMapperService } from 'src/app/services/class-mapper.service';
import { Venta }              from 'src/app/model/venta.model';
import { LineaVenta }         from 'src/app/model/lineaventa.model';

@Component({
	selector: 'otpv-una-venta',
	templateUrl: './una-venta.component.html',
	styleUrls: ['./una-venta.component.scss']
})
export class UnaVentaComponent {
	@Input() venta: Venta = new Venta();
	@Output() deleteVentaLineaEvent = new EventEmitter<number>();
	@Output() showDetailsEvent = new EventEmitter<number>();
	searching: boolean = false;
	muestraDescuento: boolean = false;
	descuentoOptions: number[] = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
	descuentoSelected: number = null;

	constructor(private as: ApiService, private cms: ClassMapperService, private dialog: DialogService) {}

	addLineaVenta(): void {
		this.venta.lineas.push(new LineaVenta());
		setTimeout(() => {
			this.setFocus();
		}, 200);
	}

	setFocus(): void {
		const loc: HTMLInputElement = document.getElementById('loc-new') as HTMLInputElement;
		setTimeout(() => {
			loc.focus();
		}, 200);
	}

	checkLocalizador(ev:  KeyboardEvent, ind: number) {
		if (ev.key==='Enter') {
			this.searching = true;
			this.as.loadArticulo(this.venta.lineas[ind].localizador).subscribe(result => {
				this.searching = false;
				if (result.status === 'ok') {
					const articulo = this.cms.getArticulo(result.articulo);
					const indArticulo = this.venta.lineas.findIndex(x => x.idArticulo === articulo.id);

					if (indArticulo === -1) {
						this.venta.lineas[ind] = new LineaVenta().fromArticulo(articulo);
						this.addLineaVenta();
					}
					else {
						this.venta.lineas[indArticulo].cantidad++;
						this.venta.lineas[ind].localizador = null;
						this.setFocus();
					}

					this.venta.updateImporte();
				}
				else {
					this.dialog.alert({title: 'Error', content: '¡El código introducido no se encuentra!', ok: 'Continuar'}).subscribe(result => {
						this.venta.lineas[ind].localizador = null;
						this.setFocus();
					});
				}
			});
		}
	}

	goToArticulos(loc: number): void {
		this.showDetailsEvent.emit(loc);
	}

	borraLinea(ind: number): void {
		this.dialog.confirm({title: '¡Atención!', content: '¿Está seguro de querer borrar esta línea?', ok: 'Confirmar', cancel: 'Cancelar'}).subscribe(result => {
			if (result===true) {
				this.deleteVentaLineaEvent.emit(ind);
			}
		});
	}

	updateCantidad(ind: number): void {
		if (!this.venta.lineas[ind].cantidad) {
			this.venta.lineas[ind].cantidad = 1;
		}
		this.venta.updateImporte();
	}

	selectCantidad(ev: MouseEvent): void {
		(ev.target as HTMLInputElement).select();
	}

	abreDescuento(linea: LineaVenta): void {
		this.descuentoSelected = linea.idArticulo;
		this.muestraDescuento = true;
	}

	cerrarDescuento(ev: MouseEvent): void {
		ev.preventDefault();
		this.muestraDescuento = false;
	}
}
