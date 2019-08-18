import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable }              from '@angular/core';
import { Observable }              from 'rxjs';
import { environment }             from '../../environments/environment';

import {
  StartDataResult,
  AppData,
  StatusResult,
  MarcasResult,
  ProveedoresResult,
  CategoriasResult
} from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl = environment.apiUrl;

  constructor(private http : HttpClient){}

  checkStart(date: string): Observable<StartDataResult> {
    return this.http.post<StartDataResult>(this.apiUrl + 'checkStart', {date});
  }
  
  saveInstallation(data: AppData): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + 'saveInstallation', data);
  }
  
  openBox(): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + 'openBox', {});
  }
  
  getMarcas(): Observable<MarcasResult> {
    return this.http.post<MarcasResult>(this.apiUrl + 'getMarcas', {});
  }
  
  getProveedores(): Observable<ProveedoresResult> {
    return this.http.post<ProveedoresResult>(this.apiUrl + 'getProveedores', {});
  }
  
  getCategorias(): Observable<CategoriasResult> {
    return this.http.post<CategoriasResult>(this.apiUrl + 'getCategorias', {});
  }
  
  disableProduct(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + 'disableProduct', {id});
  }
}