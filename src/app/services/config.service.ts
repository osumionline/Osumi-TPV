import { Injectable }         from '@angular/core';
import { TipoPago }           from 'src/app/model/tipo-pago.model';
import { IVAOption }          from 'src/app/model/iva-option.model';
import { ApiService }         from 'src/app/services/api.service';
import { ClassMapperService } from 'src/app/services/class-mapper.service';
import { MarcasService }      from 'src/app/services/marcas.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { EmpleadosService }   from 'src/app/services/empleados.service';
import {
	AppDataInterface,
	Month,
	ProvinceInterface
} from 'src/app/interfaces/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ConfigService {
	status: string = 'new';
	nombre: string = '';
	cif: string = '';
	telefono: string = '';
	direccion: string = '';
	email: string = '';
	tipoIva: string = '';
	ivaOptions: IVAOption[] = [];
	marginList: number[] = [];
	ventaOnline: boolean = false;
	fechaCad: boolean = false;
	tiposPago: TipoPago[] = [];
	isOpened: boolean = false;

	monthList: Month[] = [
		{id: 1,  name: 'Enero',      days: 31},
		{id: 2,  name: 'Febrero',    days: 28},
		{id: 3,  name: 'Marzo',      days: 31},
		{id: 4,  name: 'Abril',      days: 30},
		{id: 5,  name: 'Mayo',       days: 31},
		{id: 6,  name: 'Junio',      days: 30},
		{id: 7,  name: 'Julio',      days: 31},
		{id: 8,  name: 'Agosto',     days: 31},
		{id: 9,  name: 'Septiembre', days: 30},
		{id: 10, name: 'Octubre',    days: 31},
		{id: 11, name: 'Noviembre',  days: 30},
		{id: 12, name: 'Diciembre',  days: 31}
	];

	provincias: ProvinceInterface[] = [];

	constructor(
		private as: ApiService,
		private cms: ClassMapperService,
		private ms: MarcasService,
		private ps: ProveedoresService,
		private es: EmpleadosService
	) {}

	start(): Promise<string> {
		return new Promise((resolve, reject) => {
			if (this.status === 'loaded') {
				resolve(this.status);
			}
			else {
				const d: Date = new Date();
				const date = d.getFullYear() + '-' + (((d.getMonth()+1)<10) ? '0'+(d.getMonth()+1) : (d.getMonth()+1)) + '-' + ((d.getDate()<10) ? '0'+d.getDate() : d.getDate());
				this.as.checkStart(date).subscribe(result => {
					if (result.appData===null) {
						this.status = 'install';
					}
					else {
						this.load(result.appData);
						this.tiposPago = this.cms.getTiposPago(result.tiposPago);
						this.isOpened = result.opened;
						this.status = 'loaded';
						this.ms.load();
						this.ps.load();
						this.es.load();
						this.loadProvinces();
					}
					resolve(this.status);
				});
			}
		});
	}

	load(data: AppDataInterface): void {
		this.nombre = data.nombre;
		this.cif = data.cif;
		this.telefono = data.telefono;
		this.direccion = data.direccion;
		this.email = data.email;
		this.tipoIva = data.tipoIva;
		for (let i in data.ivaList) {
			if (this.tipoIva === 'iva') {
				this.ivaOptions.push(new IVAOption(this.tipoIva, data.ivaList[i]));
			}
			else {
				this.ivaOptions.push(new IVAOption(this.tipoIva, data.ivaList[i], data.reList[i]));
			}
		}
		this.marginList = data.marginList;
		this.ventaOnline = data.ventaOnline;
		this.fechaCad = data.fechaCad;
	}

	loadProvinces(): void {
		this.as.getProvinceList().subscribe(data => {
			let newList = [];
			for (let ccaa of data.ccaa){
				newList = newList.concat(ccaa.provinces);
			}
			newList.sort(function (a, b) {
				return a.name.localeCompare(b.name);
			});

			this.provincias = newList;
		});
	}
}
