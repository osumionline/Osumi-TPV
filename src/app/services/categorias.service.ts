import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CategoriasResult } from "src/app/interfaces/articulo.interface";
import { Categoria } from "src/app/model/articulos/categoria.model";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class CategoriasService {
  categorias: Categoria[] = [];
  categoriasPlain: Categoria[] = [];
  loaded: boolean = false;

  constructor(private http: HttpClient) {}

  loadCategorias(list: Categoria[]): void {
    this.categorias = list;
    this.loadCategoriasPlain(list);
    this.loaded = true;
  }

  loadCategoriasPlain(catList: Categoria[] = []): void {
    for (let cat of catList) {
      this.categoriasPlain.push(
        new Categoria(cat.id, cat.nombre, cat.profundidad)
      );
      this.loadCategoriasPlain(cat.hijos);
    }
  }

  getCategorias(): Observable<CategoriasResult> {
    return this.http.post<CategoriasResult>(
      environment.apiUrl + "-categorias/get-categorias",
      {}
    );
  }
}
