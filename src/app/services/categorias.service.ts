import { Injectable } from '@angular/core';
import { CategoriasResult } from '@interfaces/articulo.interface';
import Categoria from '@model/articulos/categoria.model';
import BaseService from '@services/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class CategoriasService extends BaseService {
  categorias: Categoria[] = [];
  categoriasPlain: Categoria[] = [];
  loaded: boolean = false;

  loadCategorias(list: Categoria[]): void {
    this.categorias = list;
    this.loadCategoriasPlain(list);
    this.loaded = true;
  }

  loadCategoriasPlain(catList: Categoria[] = []): void {
    for (const cat of catList) {
      this.categoriasPlain.push(new Categoria(cat.id, cat.nombre, cat.profundidad));
      this.loadCategoriasPlain(cat.hijos);
    }
  }

  getCategorias(): Observable<CategoriasResult> {
    return this.http.post<CategoriasResult>(this.apiUrl + '-categorias/get-categorias', {});
  }
}
