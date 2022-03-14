import { HttpClient }  from '@angular/common/http';
import { Injectable }  from '@angular/core';
import { Observable }  from 'rxjs';
import { environment } from 'src/environments/environment';

import {
	StartDataInterface,
	AppDataInterface,
	StatusResult,
	AllProvincesInterface
} from 'src/app/interfaces/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	constructor(private http : HttpClient){}

	checkStart(date: string): Observable<StartDataInterface> {
		return this.http.post<StartDataInterface>(environment.apiUrl + '/check-start', {date});
	}

	saveInstallation(data: AppDataInterface): Observable<StatusResult> {
		return this.http.post<StatusResult>(environment.apiUrl + '/save-installation', data);
	}

	openBox(): Observable<StatusResult> {
		return this.http.post<StatusResult>(environment.apiUrl + '/open-box', {});
	}

	getProvinceList(): Observable<AllProvincesInterface> {
		return this.http.get<AllProvincesInterface>('/assets/provinces.json');
	}
}
