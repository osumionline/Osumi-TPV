import { Injectable } from '@angular/core';
import { AppDataInterface, Month } from 'src/app/interfaces/interfaces';
import { TipoPago } from 'src/app/model/tipo-pago.model';
import { IVAOption } from 'src/app/model/iva-option.model';

@Injectable({
	providedIn: 'root'
})
export class ConfigService {
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

	constructor() {}

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
}
