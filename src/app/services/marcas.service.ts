import { Injectable }         from '@angular/core';
import { HttpClient }         from '@angular/common/http';
import { Observable }         from 'rxjs';
import { Marca }              from 'src/app/model/marca.model';
import { ClassMapperService } from 'src/app/services/class-mapper.service';
import { environment }        from 'src/environments/environment';
import {
	MarcasResult,
	MarcaInterface,
	IdSaveResult
} from 'src/app/interfaces/interfaces';

@Injectable({
	providedIn: 'root'
})
export class MarcasService {
	marcas: Marca[] = [];
	loaded: boolean = false;

	constructor(private http : HttpClient, private cms: ClassMapperService) {}

	load(): void {
		if (!this.loaded) {
			this.getMarcas().subscribe(result => {
				this.loadMarcas( this.cms.getMarcas(result.list) );
			});
		}
	}

	getMarcas(): Observable<MarcasResult> {
		return this.http.post<MarcasResult>(environment.apiUrl + '-marcas/get-marcas', {});
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

	saveMarca(marca: MarcaInterface): Observable<IdSaveResult> {
		return this.http.post<IdSaveResult>(environment.apiUrl + '-marcas/save-marca', marca);
	}
}
