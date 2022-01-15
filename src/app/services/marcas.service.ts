import { Injectable } from '@angular/core';
import { Marca }      from 'src/app/model/marca.model';

@Injectable({
	providedIn: 'root'
})
export class MarcasService {
	marcas: Marca[] = [];
	loaded: boolean = false;

	constructor() {}

	loadMarcas(marcas: Marca[]): void {
		this.marcas = marcas;
		this.loaded = true;
	}
}
