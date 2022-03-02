import { Injectable }         from '@angular/core';
import { Marca }              from 'src/app/model/marca.model';
import { ApiService }         from 'src/app/services/api.service';
import { ClassMapperService } from 'src/app/services/class-mapper.service';

@Injectable({
	providedIn: 'root'
})
export class MarcasService {
	marcas: Marca[] = [];
	loaded: boolean = false;

	constructor(private as: ApiService, private cms: ClassMapperService) {}

	load(): void {
		if (!this.loaded) {
			this.as.getMarcas().subscribe(result => {
				this.loadMarcas( this.cms.getMarcas(result.list) );
			});
		}
	}

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
