import { Injectable } from '@angular/core';
import { Categoria }  from 'src/app/model/categoria.model';

@Injectable({
	providedIn: 'root'
})
export class CategoriasService {
	categorias: Categoria[] = [];
	categoriasPlain: Categoria[] = [];
	loaded: boolean = true;
}
