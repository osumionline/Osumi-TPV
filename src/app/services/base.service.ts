import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import ClassMapperService from '@services/class-mapper.service';

@Injectable({
  providedIn: 'root',
})
export default class BaseService {
  http: HttpClient = inject(HttpClient);
  cms: ClassMapperService = inject(ClassMapperService);

  apiUrl: string = environment.apiUrl;
}
