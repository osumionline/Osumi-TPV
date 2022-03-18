import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { DialogService }      from 'src/app/services/dialog.service';
import { ClassMapperService } from 'src/app/services/class-mapper.service';
import { MarcasService }      from 'src/app/services/marcas.service';
import { VentasService }      from 'src/app/services/ventas.service';
import { ArticulosService }   from 'src/app/services/articulos.service';
import { EmpleadosService }   from 'src/app/services/empleados.service';
import { Venta }              from 'src/app/model/venta.model';
import { LineaVenta }         from 'src/app/model/linea-venta.model';
import { Empleado }           from 'src/app/model/empleado.model';

@Component({
	selector: 'otpv-una-venta',
	templateUrl: './una-venta.component.html',
	styleUrls: ['./una-venta.component.scss']
})
export class UnaVentaComponent {
	@Input() venta: Venta = new Venta();
	@Output() deleteVentaLineaEvent = new EventEmitter<number>();
	@Output() endVentaEvent = new EventEmitter<number>();
	muestraLogin: boolean = false;
	selectedEmpleado: Empleado = new Empleado();
	@ViewChild('loginPasswordValue', { static: true }) loginPasswordValue: ElementRef;
	loginLoading: boolean = false;
	searching: boolean = false;
	editarCantidad: boolean = false;
	editarImporte: boolean = false;
	editarDescuento: boolean = false;
	muestraDescuento: boolean = false;
	descuentoSelected: number = null;
	descuentoImporte: number = null;
	@ViewChild('descuentoValue', { static: true }) descuentoValue: ElementRef;

	showClienteEstadisticas: boolean = true;

	constructor(
		private cms: ClassMapperService,
		private dialog: DialogService,
		private ms: MarcasService,
		private vs: VentasService,
		private ars: ArticulosService,
		public es: EmpleadosService
	) {}

	@HostListener('window:keydown', ['$event'])
	onKeyDown(ev: KeyboardEvent) {
		if (ev.key === 'Escape') {
			if (this.muestraLogin && !this.loginLoading) {
				this.cerrarLogin();
			}
		}
	}

	abreLogin(empleado: Empleado): void {
		this.selectedEmpleado = empleado;
		this.selectedEmpleado.pass = '';
		this.muestraLogin = true;
		setTimeout(() => {
			this.loginPasswordValue.nativeElement.focus();
		}, 0);
	}

	cerrarLogin(ev: MouseEvent = null): void {
		ev && ev.preventDefault();
		this.muestraLogin = false;
	}

	checkLoginPassword(ev: KeyboardEvent): void {
		if (ev.key=='Enter') {
			this.login();
		}
	}

	login(): void {
		if (this.selectedEmpleado.pass === '') {
			this.dialog.alert({title: 'Error', content: '¡No puedes dejar la contraseña en blanco!', ok: 'Continuar'}).subscribe(result => {
				setTimeout(() => {
					this.loginPasswordValue.nativeElement.focus();
				}, 0);
			});
		}
		else {
			this.loginLoading = true;
			this.es.login(this.selectedEmpleado.toLoginInterface()).subscribe(result => {
				this.loginLoading = false;
				if (result.status === 'ok') {
					this.venta.idEmpleado = this.selectedEmpleado.id;
					this.cerrarLogin();
					this.venta.mostrarEmpleados = false;
					this.setFocus();
				}
				else {
					this.dialog.alert({title: 'Error', content: 'Contraseña incorrecta.', ok: 'Continuar'}).subscribe(result => {
						setTimeout(() => {
							this.loginPasswordValue.nativeElement.focus();
						}, 0);
					});
				}
			});

		}
	}

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
					}
					this.setFocus();

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

	showObservaciones(ev: MouseEvent, observaciones: string): void {
		ev.stopPropagation();
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

	editarLineaCantidad(ind: number): void {
		this.editarCantidad = true;
		setTimeout(() => {
			const cantidad: HTMLInputElement = document.getElementById('linea-cantidad-' + ind) as HTMLInputElement;
			cantidad.select();
		}, 0);
	}

	checkCantidad(ev: KeyboardEvent, ind: number, close: boolean): void {
		if (ev.key=='Enter' || close) {
			this.editarCantidad = false;
			this.venta.updateImporte();
			this.setFocus();
		}
	}

	editarLineaImporte(ind: number): void {
		if (this.venta.lineas[ind].descuentoManual) {
			this.dialog.alert({title: 'Atención', content: 'Se ha introducido un descuento a mano para el artículo, de modo que no se puede introducir un importe', ok: 'Continuar'}).subscribe(result => {
				this.setFocus();
			});
			return;
		}
		this.editarImporte = true;
		setTimeout(() => {
			const importe: HTMLInputElement = document.getElementById('linea-importe-' + ind) as HTMLInputElement;
			importe.select();
		}, 0);
	}

	checkImporte(ev: KeyboardEvent, ind: number, close: boolean): void {
		if (ev.key=='Enter' || close) {
			this.editarImporte = false;
			this.venta.lineas[ind].importeManual = true;
			this.venta.updateImporte();
			this.setFocus();
		}
	}

	quitaImporteManual(ev: MouseEvent, ind: number): void {
		ev.stopPropagation();
		this.venta.lineas[ind].importeManual = false;
		this.setFocus();
	}

	editarLineaDescuento(ind: number): void {
		if (this.venta.lineas[ind].importeManual) {
			this.dialog.alert({title: 'Atención', content: 'Se ha introducido un importe a mano para el artículo, de modo que no se puede introducir un descuento', ok: 'Continuar'}).subscribe(result => {
				this.setFocus();
			});
			return;
		}
		if (this.venta.lineas[ind].descuentoManual) {
			this.dialog.alert({title: 'Atención', content: 'Se ha introducido un descuento a mano para el artículo, de modo que no se puede introducir un importe', ok: 'Continuar'}).subscribe(result => {
				this.setFocus();
			});
			return;
		}
		this.editarDescuento = true;
		setTimeout(() => {
			const descuento: HTMLInputElement = document.getElementById('linea-descuento-' + ind) as HTMLInputElement;
			descuento.select();
		}, 0);
	}

	checkDescuento(ev: KeyboardEvent, ind: number, close: boolean): void {
		if (ev.key=='Enter' || close) {
			this.editarDescuento = false;
			this.venta.updateImporte();
			this.setFocus();
		}
	}

	quitaDescuentoManual(ev: MouseEvent, ind: number): void {
		ev.stopPropagation();
		this.venta.lineas[ind].descuento = 0;
		this.venta.lineas[ind].descuentoManual = false;
		this.setFocus();
	}

	abreDescuento(ev: MouseEvent, linea: LineaVenta): void {
		ev.stopPropagation();
		this.descuentoSelected = linea.idArticulo;
		this.descuentoImporte = null;
		this.muestraDescuento = true;
		setTimeout(() => {
			this.descuentoValue.nativeElement.focus();
		}, 0);
	}

	cerrarDescuento(ev: MouseEvent = null): void {
		ev && ev.preventDefault();
		this.muestraDescuento = false;
	}

	checkDescuentoImporte(ev: KeyboardEvent): void {
		if (ev.key=='Enter') {
			this.selectDescuento();
		}
	}

	selectDescuento(): void {
		if (!this.descuentoImporte) {
			this.dialog.alert({title: 'Error', content: '¡No has introducido ningún descuento!', ok: 'Continuar'}).subscribe(result => {
				setTimeout(() => {
					this.descuentoValue.nativeElement.focus();
				}, 0);
			});
			return;
		}
		const ind = this.venta.lineas.findIndex(x => x.idArticulo === this.descuentoSelected);
		this.venta.lineas[ind].descuento = this.descuentoImporte;
		this.venta.lineas[ind].descuentoManual = true;
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
