import { Injectable } from '@angular/core';
import { AppDataInterface } from 'src/app/interfaces/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ConfigService {
	tipoIva: string = '';
	ivaList: number[] = [];
	marginList: number[] = [];
	ventaOnline: boolean = false;
	fechaCad: boolean = false;

	constructor() {}

	load(data: AppDataInterface): void {
		this.tipoIva = data.tipoIva;
		this.ivaList = data.ivaList;
		this.marginList = data.marginList;
		this.ventaOnline = data.ventaOnline;
		this.fechaCad = data.fechaCad;
	}
}
