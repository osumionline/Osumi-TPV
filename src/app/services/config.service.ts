import { Injectable } from '@angular/core';
import { AppDataInterface } from 'src/app/interfaces/interfaces';
import { Tarjeta } from 'src/app/model/tarjeta.model';

@Injectable({
	providedIn: 'root'
})
export class ConfigService {
	tipoIva: string = '';
	ivaList: number[] = [];
	reList: number[] = [];
	marginList: number[] = [];
	ventaOnline: boolean = false;
	fechaCad: boolean = false;
	tarjetas: Tarjeta[] = [];

	constructor() {}

	load(data: AppDataInterface): void {
		this.tipoIva = data.tipoIva;
		this.ivaList = data.ivaList;
		this.reList = data.reList;
		this.marginList = data.marginList;
		this.ventaOnline = data.ventaOnline;
		this.fechaCad = data.fechaCad;
	}
}
