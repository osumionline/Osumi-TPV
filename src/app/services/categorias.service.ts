import { Injectable } from '@angular/core';
import { Categoria }  from 'src/app/model/categoria.model';

@Injectable({
	providedIn: 'root'
})
export class CategoriasService {
	categorias: Categoria[] = [];
	categoriasPlain: Categoria[] = [];
	loaded: boolean = true;

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
}
