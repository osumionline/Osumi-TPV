import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ApiService }        from 'src/app/services/api.service';
import { DataShareService }  from 'src/app/services/data-share.service';
import { DialogService }     from 'src/app/services/dialog.service';
import { CommonService }     from 'src/app/services/common.service';
import { AppData, Marca, Proveedor, Articulo, Categoria, CodigoBarras, Month } from 'src/app/interfaces/interfaces';

@Component({
	selector: 'otpv-articulos',
	templateUrl: './articulos.component.html',
	styleUrls: ['./articulos.component.scss']
})
export class ArticulosComponent implements OnInit {
	articulo: Articulo = {
		id: null,
		localizador: null,
		nombre: 'Nuevo artículo',
		puc: 0,
		pvp: 0,
		margen: 0,
		palb: 0,
		idMarca: null,
		idProveedor: null,
		stock: 0,
		stockMin: 0,
		stockMax: 0,
		loteOptimo: 0,
		iva: null,
		fechaCaducidad: null,
		mostrarFecCad: false,
		observaciones: null,
		mostrarObsPedidos: false,
		mostrarObsVentas: false,
		referencia: null,
		ventaOnline: false,
		mostrarEnWeb: false,
		idCategoria: null,
		descCorta: '',
		desc: null,
		codigosBarras: [],
		activo: true
	};

	marca: Marca = {
		id: null,
		nombre: null,
		telefono: null,
		email: null,
		web: null,
		observaciones: null
	};

	proveedor: Proveedor = {
		id: null,
		nombre: null,
		direccion: null,
		telefono: null,
		email: null,
		web: null,
		observaciones: null,
		marcas: []
	};

	loading: boolean = false;
	selectedTab: number = -1;
	@ViewChild('localizadorBox', { static: true }) localizadorBox:ElementRef;
	mostrarWeb: boolean = false;
	marcas: Marca[] = [];
	nuevaMarca: boolean = false;
	proveedores: Proveedor[] = [];
	nuevoProveedor: boolean = false;
	ivaLabel: string = 'IVA';
	ivaList: number[] = [];
	categoriesPlain = [];
	fecCadMonth: number = null;
	fecCadYear: number = null;
	monthList: Month[] = [
		{id: 1, name: 'Enero'},
		{id: 2, name: 'Febrero'},
		{id: 3, name: 'Marzo'},
		{id: 4, name: 'Abril'},
		{id: 5, name: 'Mayo'},
		{id: 6, name: 'Junio'},
		{id: 7, name: 'Julio'},
		{id: 8, name: 'Agosto'},
		{id: 9, name: 'Septiembre'},
		{id: 10, name: 'Octubre'},
		{id: 11, name: 'Noviembre'},
		{id: 12, name: 'Diciembre'}
	];
	yearList: number[] = [];
	newCodBarras: number = null;
	confirmarDarDeBaja: boolean = false;
	darDeBajaLoading: boolean = false;

	constructor(private dialog: DialogService,
                private as: ApiService,
                private dss: DataShareService,
                private cs: CommonService) {}

	ngOnInit(): void {
		const d = new Date();
		for (let y = d.getFullYear(); y<(d.getFullYear()+5); y++) {
			this.yearList.push(y);
		}
	}

	loadAppData(appData: AppData): void {
		this.mostrarWeb = appData.ventaOnline;
		if (appData.tipoIva=='iva') {
			this.ivaLabel = 'IVA';
		}
		else {
			this.ivaLabel = 'Recargo de equivalencia';
		}
		this.ivaList = appData.ivaList;

		this.loadData();
	}

	loadData(): void {
		this.loadMarcas();
		this.loadProveedores();
		this.loadCategorias();

		this.newArticulo();
	}

	loadMarcas(): void {
		const marcasList = this.dss.getGlobal('marcas');
		if (marcasList) {
			this.marcas = marcasList;
		}
		else {
			this.as.getMarcas().subscribe(result => {
				this.marcas = result.list;
				this.dss.setGlobal('marcas', result.list);
			});
		}
	}

	loadProveedores(): void {
		const proveedoresList = this.dss.getGlobal('proveedores');
		if (proveedoresList) {
			this.proveedores = proveedoresList;
		}
		else {
			this.as.getProveedores().subscribe(result => {
				this.proveedores = result.list;
				this.dss.setGlobal('proveedores', result.list);
			});
		}
	}

	loadCategorias(): void {
		this.as.getCategorias().subscribe(result => {
			this.loadCategoriesPlain([result.list]);
		});
	}

	loadCategoriesPlain(catList:Categoria[]=null): void {
		for (let cat of catList) {
			this.categoriesPlain.push({id: cat.id, nombre: cat.nombre, profundidad: cat.profundidad});
			this.loadCategoriesPlain(cat.hijos);
		}
	}

	showDetails(loc: number): void {
		this.articulo.localizador = loc;
		this.loadArticulo();
	}

	checkLocalizador(ev: KeyboardEvent): void {
		if (ev.key=='Enter') {
			this.loadArticulo();
		}
	}

	loadArticulo(): void {
		this.loading = true;

		this.as.loadArticulo(this.articulo.localizador).subscribe(result => {
			this.articulo = {
				id: result.articulo.id,
				localizador: result.articulo.localizador,
				nombre: this.cs.urldecode(result.articulo.nombre),
				puc: result.articulo.puc,
				pvp: result.articulo.pvp,
				margen: result.articulo.margen,
				palb: result.articulo.palb,
				idMarca: result.articulo.idMarca,
				idProveedor: result.articulo.idProveedor,
				stock: result.articulo.stock,
				stockMin: result.articulo.stockMin,
				stockMax: result.articulo.stockMax,
				loteOptimo: result.articulo.loteOptimo,
				iva: result.articulo.iva,
				fechaCaducidad: result.articulo.fechaCaducidad,
				mostrarFecCad: result.articulo.mostrarFecCad,
				observaciones: this.cs.urldecode(result.articulo.observaciones),
				mostrarObsPedidos: result.articulo.mostrarObsPedidos,
				mostrarObsVentas: result.articulo.mostrarObsVentas,
				referencia: result.articulo.referencia,
				ventaOnline: result.articulo.ventaOnline,
				mostrarEnWeb: result.articulo.mostrarEnWeb,
				idCategoria: result.articulo.idCategoria,
				descCorta: result.articulo.descCorta,
				desc: result.articulo.desc,
				codigosBarras: [],
				activo: result.articulo.activo
			};

			if (this.articulo.mostrarFecCad) {
				const fecCad = this.articulo.fechaCaducidad.split('/');

				this.fecCadMonth = parseInt(fecCad[0]);
				this.fecCadYear  = parseInt(fecCad[1]);
			}

			for (let cb of result.articulo.codigosBarras) {
				this.articulo.codigosBarras.push(cb);
			}
			this.selectedTab = 0;
			this.loading = false;
		});
	}

	newArticulo(): void {
		this.articulo = {
			id: null,
			localizador: null,
			nombre: 'Nuevo artículo',
			puc: 0,
			pvp: 0,
			margen: 0,
			palb: 0,
			idMarca: null,
			idProveedor: null,
			stock: 0,
			stockMin: 0,
			stockMax: 0,
			loteOptimo: 0,
			iva: null,
			fechaCaducidad: null,
			mostrarFecCad: false,
			observaciones: null,
			mostrarObsPedidos: false,
			mostrarObsVentas: false,
			referencia: null,
			ventaOnline: false,
			mostrarEnWeb: false,
			idCategoria: null,
			descCorta: '',
			desc: null,
			codigosBarras: [],
			activo: true
		};

		this.selectedTab = 0;
		setTimeout(() => {
			this.localizadorBox.nativeElement.focus();
		}, 200);
	}

	newMarca(): void {
		this.marca = {
			id: null,
			nombre: null,
			telefono: null,
			email: null,
			web: null,
			observaciones: null
		};

		this.nuevaMarca = true;
	}

	newMarcaCerrar(ev: MouseEvent = null):  void {
		ev && ev.preventDefault();
		this.nuevaMarca = false;
	}

	guardarMarca(): void {
		if (!this.marca.nombre) {
			this.dialog.alert({title: 'Error', content: '¡No puedes dejar el nombre de la marca en blanco!', ok: 'Continuar'}).subscribe(result => {});
			return;
		}

		this.as.saveMarca(this.marca).subscribe(result => {
			if (result.status=='ok') {
				this.articulo.idMarca = result.id;
				this.dss.removeGlobal('marcas');
				this.loadMarcas();
				this.newMarcaCerrar();
			}
			else {
				this.dialog.alert({title: 'Error', content: 'Ocurrió un error al guardar la nueva marca', ok: 'Continuar'}).subscribe(result => {});
				return;
			}
		});
	}

	newProveedor(): void {
		this.proveedor = {
			id: null,
			nombre: null,
			direccion: null,
			telefono: null,
			email: null,
			web: null,
			observaciones: null,
			marcas: []
		};

		this.nuevoProveedor = true;
	}

	newProveedorCerrar(ev: MouseEvent = null): void {
		ev && ev.preventDefault();
		this.nuevoProveedor = false;
	}

	addMarcaToProveedor(marca: Marca, ev: MatCheckboxChange): void {
		const ind: number = this.proveedor.marcas.findIndex(x => x==marca.id);

		if (ev.checked) {
			if (ind===-1) {
				this.proveedor.marcas.push(marca.id);
			}
		}
		else {
			if (ind!==-1) {
				this.proveedor.marcas.splice(ind, 1);
			}
		}
	}

	guardarProveedor(): void {
		if (!this.proveedor.nombre) {
			this.dialog.alert({title: 'Error', content: '¡No puedes dejar el nombre del proveedor en blanco!', ok: 'Continuar'}).subscribe(result => {});
			return;
		}

		if (this.proveedor.marcas.length==0) {
			this.dialog.confirm({title: 'Confirmar', content: 'No has elegido ninguna marca para el proveedor, ¿quieres continuar?', ok: 'Continuar', cancel: 'Cancelar'}).subscribe(result => {
				if (result===true) {
					this.guardarProveedorContinue();
				}
			});
		}
		else {
			this.guardarProveedorContinue();
		}
	}

	guardarProveedorContinue(): void {
		this.as.saveProveedor(this.proveedor).subscribe(result => {
			if (result.status=='ok') {
				this.articulo.idProveedor = result.id;
				this.dss.removeGlobal('proveedores');
				this.loadProveedores();
				this.newProveedorCerrar();
			}
			else {
				this.dialog.alert({title: 'Error', content: 'Ocurrió un error al guardar el nuevo proveedor', ok: 'Continuar'}).subscribe(result => {});
				return;
			}
		});
	}

	updateFecCaducidad(): void {
		this.fecCadMonth = null;
		this.fecCadYear = null;
	}

	setTwoNumberDecimal(ev: Event): void {
		const target = (ev.target as HTMLInputElement);
		target.value = (target.value!='') ? parseFloat(target.value).toFixed(2) : '0.00';
	}

	fixCodBarras(ev: KeyboardEvent = null): void {
		if (ev) {
			if (ev.key==='Enter') {
				this.addNewCodBarras();
			}
		}
		else {
			this.addNewCodBarras();
		}
	}

	addNewCodBarras(): void {
		if (this.newCodBarras) {
			const cb: CodigoBarras = {
				id: null,
				codigoBarras: this.newCodBarras,
				porDefecto: false
			};

			this.articulo.codigosBarras.push(cb);
			this.newCodBarras = null;
		}
	}

	deleteCodBarras(codBarras: CodigoBarras): void {
		const ind: number = this.articulo.codigosBarras.findIndex(x => x.codigoBarras == codBarras.codigoBarras);
		this.articulo.codigosBarras.splice(ind, 1);
	}

	darDeBaja(): void {
		this.confirmarDarDeBaja = true;
	}

	darDeBajaCerrar(ev: MouseEvent): void {
		ev.preventDefault();
		this.confirmarDarDeBaja = false;
	}

	darDeBajaOk(): void {
		this.darDeBajaLoading = true;
		this.as.disableProduct(this.articulo.id).subscribe(response => {
			if (response.status=='ok') {
				this.dialog.alert({title: 'Éxito', content: 'El artículo "'+this.articulo.nombre+'" ha sido dado de baja.', ok: 'Continuar'}).subscribe(result => {
					this.newArticulo();
				});
			}
			else {
				this.dialog.alert({title: 'Error', content: '¡Ocurrió un error al dar de baja el artículo!', ok: 'Continuar'}).subscribe(result => {});
			}
		});
	}

	cancelar(): void {

	}

	guardar(): void {
		this.articulo.stock      = this.articulo.stock      || 0;
		this.articulo.stockMin   = this.articulo.stockMin   || 0;
		this.articulo.stockMax   = this.articulo.stockMax   || 0;
		this.articulo.loteOptimo = this.articulo.loteOptimo || 0;

		if (!this.articulo.idMarca) {
			this.dialog.alert({title: 'Error', content: '¡No has elegido la marca del artículo!', ok: 'Continuar'}).subscribe(result => {});
			this.selectedTab = 0;
			return;
		}

		if (!this.articulo.iva) {
			this.dialog.alert({title: 'Error', content: '¡No has elegido IVA para el artículo!', ok: 'Continuar'}).subscribe(result => {});
			this.selectedTab = 0;
			return;
		}

		if (this.articulo.mostrarFecCad) {
			if (!this.fecCadMonth) {
				this.dialog.alert({title: 'Error', content: 'Has indicado que el artículo tiene fecha de caducidad, pero no has elegido el mes.', ok: 'Continuar'}).subscribe(result => {});
				this.selectedTab = 1;
				return;
			}
			if (!this.fecCadYear) {
				this.dialog.alert({title: 'Error', content: 'Has indicado que el artículo tiene fecha de caducidad, pero no has elegido el año.', ok: 'Continuar'}).subscribe(result => {});
				this.selectedTab = 1;
				return;
			}
			this.articulo.fechaCaducidad = ((this.fecCadMonth<10) ? '0'+this.fecCadMonth : this.fecCadMonth) + '/' + this.fecCadYear;
		}

		this.as.saveArticulo(this.articulo).subscribe(result => {
			this.articulo.localizador = result.localizador;
			this.dialog.alert({title: 'Información', content: 'El artículo ha sido guardado correctamente.', ok: 'Continuar'}).subscribe(result => {
				this.loadArticulo();
			});
		});
	}
}
