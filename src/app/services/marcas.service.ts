import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IdSaveResult, StatusResult } from "src/app/interfaces/interfaces";
import {
  MarcaInterface,
  MarcasResult,
} from "src/app/interfaces/marca.interface";
import { Marca } from "src/app/model/marca.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MarcasService {
  marcas: Marca[] = [];
  loaded: boolean = false;

  constructor(private http: HttpClient, private cms: ClassMapperService) {}

  load(): Promise<string> {
    return new Promise((resolve) => {
      if (this.loaded) {
        resolve("ok");
      } else {
        this.getMarcas().subscribe((result: MarcasResult): void => {
          this.loadMarcas(this.cms.getMarcas(result.list));
          resolve("ok");
        });
      }
    });
  }

  getMarcas(): Observable<MarcasResult> {
    return this.http.post<MarcasResult>(
      environment.apiUrl + "-marcas/get-marcas",
      {}
    );
  }

  loadMarcas(marcas: Marca[]): void {
    this.marcas = marcas;
    this.loaded = true;
  }

  resetMarcas(): void {
    this.loaded = false;
    this.load();
  }

  findById(id: number): Marca {
    const ind: number = this.marcas.findIndex(
      (x: Marca): boolean => x.id === id
    );
    if (ind !== -1) {
      return this.marcas[ind];
    }
    return null;
  }

  saveMarca(marca: MarcaInterface): Observable<IdSaveResult> {
    return this.http.post<IdSaveResult>(
      environment.apiUrl + "-marcas/save-marca",
      marca
    );
  }

  deleteMarca(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + "-marcas/delete-marca",
      { id }
    );
  }
}
