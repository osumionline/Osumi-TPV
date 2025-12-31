import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { environment } from '@env/environment';
import { IdSaveResult, StatusResult } from '@interfaces/interfaces';
import { MarcaInterface, MarcasResult } from '@interfaces/marca.interface';
import Marca from '@model/marcas/marca.model';
import ClassMapperService from '@services/class-mapper.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class MarcasService {
  private http: HttpClient = inject(HttpClient);
  private cms: ClassMapperService = inject(ClassMapperService);

  marcas: WritableSignal<Marca[]> = signal<Marca[]>([]);
  loaded: boolean = false;

  load(): Promise<string> {
    return new Promise((resolve) => {
      if (this.loaded) {
        resolve('ok');
      } else {
        this.getMarcas().subscribe((result: MarcasResult): void => {
          this.loadMarcas(this.cms.getMarcas(result.list));
          resolve('ok');
        });
      }
    });
  }

  getMarcas(): Observable<MarcasResult> {
    return this.http.post<MarcasResult>(environment.apiUrl + '-marcas/get-marcas', {});
  }

  loadMarcas(marcas: Marca[]): void {
    this.marcas.set(marcas);
    this.loaded = true;
  }

  resetMarcas(): void {
    this.loaded = false;
    this.load();
  }

  findById(id: number): Marca | null {
    const ind: number = this.marcas().findIndex((x: Marca): boolean => x.id === id);
    if (ind !== -1) {
      return this.marcas()[ind];
    }
    return null;
  }

  saveMarca(marca: MarcaInterface): Observable<IdSaveResult> {
    return this.http.post<IdSaveResult>(environment.apiUrl + '-marcas/save-marca', marca);
  }

  deleteMarca(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(environment.apiUrl + '-marcas/delete-marca', { id });
  }
}
