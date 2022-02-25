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
