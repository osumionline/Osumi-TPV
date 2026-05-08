import { Injectable } from '@angular/core';
import {
  CategoriaArticulosResult,
  CategoriaArticulosSave,
  CategoriaInterface,
  CategoriasResult,
} from '@interfaces/articulo.interface';
import { IdSaveResult, StatusResult } from '@interfaces/interfaces';
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

  load(): Promise<string> {
    return new Promise((resolve) => {
      if (this.loaded) {
        resolve('ok');
      } else {
        this.getCategorias().subscribe((result: CategoriasResult): void => {
          this.loadCategorias([this.cms.getCategoria(result.list)]);
          resolve('ok');
        });
      }
    });
  }

  loadCategorias(list: Categoria[]): void {
    // Marco categorías de Inicio como desplegada
    list[0].deployed = true;

    this.categorias = list;
    this.loadCategoriasPlain(list);
    this.loaded = true;
  }

  loadCategoriasPlain(catList: Categoria[] = []): void {
    for (const cat of catList) {
      this.categoriasPlain.push(new Categoria(cat.id, cat.idPadre, cat.nombre, cat.profundidad));
      this.loadCategoriasPlain(cat.hijos);
    }
  }

  getCategorias(): Observable<CategoriasResult> {
    return this.http.post<CategoriasResult>(this.apiUrl + '-categorias/get-categorias', {});
  }

  getArticulosCategoria(id: number): Observable<CategoriaArticulosResult> {
    return this.http.post<CategoriaArticulosResult>(
      this.apiUrl + '-categorias/get-articulos-categoria',
      { id },
    );
  }

  saveArticulosCategoria(data: CategoriaArticulosSave): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + '-categorias/save-articulos-categoria', data);
  }

  saveCategoria(categoria: CategoriaInterface): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + '-categorias/save-categoria', categoria);
  }

  deleteCategoria(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + '-categorias/delete-categoria', { id });
  }

  addCategoria(categoria: CategoriaInterface): Observable<IdSaveResult> {
    return this.http.post<IdSaveResult>(this.apiUrl + '-categorias/add-categoria', categoria);
  }
}
