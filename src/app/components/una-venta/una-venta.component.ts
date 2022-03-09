import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DialogService }      from 'src/app/services/dialog.service';
import { ClassMapperService } from 'src/app/services/class-mapper.service';
import { MarcasService }      from 'src/app/services/marcas.service';
import { VentasService }      from 'src/app/services/ventas.service';
import { ArticulosService }   from 'src/app/services/articulos.service';
import { Venta }              from 'src/app/model/venta.model';
import { LineaVenta }         from 'src/app/model/linea-venta.model';

@Component({
	selector: 'otpv-una-venta',
	templateUrl: './una-venta.component.html',
	styleUrls: ['./una-venta.component.scss']
})
export class UnaVentaComponent {
	@Input() venta: Venta = new Venta();
	@Output() deleteVentaLineaEvent = new EventEmitter<number>();
	@Output() endVentaEvent = new EventEmitter<number>();
	searching: boolean = false;
	muestraDescuento: boolean = false;
	descuentoOptions: number[] = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
	descuentoSelected: number = null;
	descuentoOtro: number = null;

	showClienteEstadisticas: boolean = true;

	constructor(
		private cms: ClassMapperService,
		private dialog: DialogService,
		private ms: MarcasService,
		private vs: VentasService,
		private ars: ArticulosService
	) {}

	setFocus(): void {
		setTimeout(() => {
			const loc: HTMLInputElement = document.getElementById('loc-new') as HTMLInputElement;
			loc.focus();
		}, 0);
	}

	checkLocalizador(ev:  KeyboardEvent, ind: number) {
		if (ev.key==='Enter') {
			this.searching = true;
			this.ars.loadArticulo(this.venta.lineas[ind].localizador).subscribe(result => {
				this.searching = false;
				if (result.status === 'ok') {
					const articulo = this.cms.getArticulo(result.articulo);
					const marca = this.ms.findById(articulo.idMarca);
					articulo.marca = marca.nombre;
					const indArticulo = this.venta.lineas.findIndex(x => x.idArticulo === articulo.id);

					if (indArticulo === -1) {
						this.venta.lineas[ind] = new LineaVenta().fromArticulo(articulo);
						this.vs.addLineaVenta();
					}
					else {
						this.venta.lineas[indArticulo].cantidad++;
						this.venta.lineas[ind].localizador = null;
						this.setFocus();
					}

					this.venta.updateImporte();
					if (articulo.mostrarObsVentas && articulo.observaciones) {
						this.dialog.alert({title: 'Observaciones', content: articulo.observaciones, ok: 'Continuar'}).subscribe(result => {
							this.setFocus();
						});
					}
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

	borraLinea(ind: number): void {
		this.dialog.confirm({title: '¡Atención!', content: '¿Está seguro de querer borrar esta línea?', ok: 'Confirmar', cancel: 'Cancelar'}).subscribe(result => {
			if (result===true) {
				this.deleteVentaLineaEvent.emit(ind);
			}
		});
	}

	showObservaciones(observaciones: string): void {
		this.dialog.alert({title: 'Observaciones', content: observaciones, ok: 'Continuar'}).subscribe(result => {
			this.setFocus();
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
		this.descuentoOtro = null;
		this.muestraDescuento = true;
	}

	cerrarDescuento(ev: MouseEvent = null): void {
		ev && ev.preventDefault();
		this.muestraDescuento = false;
	}

	selectDescuento(descuento: number): void {
		const ind = this.venta.lineas.findIndex(x => x.idArticulo === this.descuentoSelected);
		this.venta.lineas[ind].descuento = descuento;
		this.venta.updateImporte();
		this.cerrarDescuento();
	}

	closeClienteEstadisticas(): void {
		this.showClienteEstadisticas = !this.showClienteEstadisticas;
	}

	cancelarVenta(): void {
		this.dialog.confirm({title: 'Confirmar', content: '¿Estás seguro de querer cancelar esta venta?', ok: 'Continuar', cancel: 'Cancelar'}).subscribe(result => {
			if (result===true) {
				this.venta.lineas = [];
				this.venta.updateImporte();
				this.vs.addLineaVenta();
			}
		});
	}

	terminarVenta(): void {
		this.endVentaEvent.emit(this.venta.id);
	}
}
