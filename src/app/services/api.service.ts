import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable }              from '@angular/core';
import { Observable }              from 'rxjs';
import { environment }             from '../../environments/environment';

import {
  StartDataResult,
  AppData,
  StatusResult
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
}