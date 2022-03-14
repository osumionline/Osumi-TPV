import { Injectable }  from '@angular/core';
import { Categoria }   from 'src/app/model/categoria.model';
import { HttpClient }  from '@angular/common/http';
import { Observable }  from 'rxjs';
import { environment } from 'src/environments/environment';

import {
	CategoriasResult
} from 'src/app/interfaces/interfaces';

@Injectable({
	providedIn: 'root'
})
export class CategoriasService {
	categorias: Categoria[] = [];
	categoriasPlain: Categoria[] = [];
	loaded: boolean = true;

	constructor(private http : HttpClient) {}

	loadCategorias(list: Categoria[]): void {
		this.categorias  = list;
		this.loadCategoriasPlain(list);
	}

	loadCategoriasPlain(catList:Categoria[] = []): void {
		for (let cat of catList) {
			this.categoriasPlain.push( new Categoria(cat.id, cat.nombre, cat.profundidad) );
			this.loadCategoriasPlain(cat.hijos);
		}
	}
	
	getCategorias(): Observable<CategoriasResult> {
		return this.http.post<CategoriasResult>(environment.apiUrl + '-categorias/get-categorias', {});
	}
}
