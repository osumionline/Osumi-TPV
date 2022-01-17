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

	findById(id: number): Marca {
		const ind = this.marcas.findIndex(x => x.id === id);
		if (ind !== -1) {
			return this.marcas[ind];
		}
		return null;
	}
}
