import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { InformeMensualResult } from "src/app/interfaces/informes.interface";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class InformesService {
  constructor(private http: HttpClient) {}

  getInformeSimple(
    month: number,
    year: number
  ): Observable<InformeMensualResult> {
    return this.http.post<InformeMensualResult>(
      environment.apiUrl + "-informes/get-informe-simple",
      { month, year }
    );
  }

  getInformeDetallado(
    month: number,
    year: number
  ): Observable<InformeMensualResult> {
    return this.http.post<InformeMensualResult>(
      environment.apiUrl + "-informes/get-informe-detallado",
      { month, year }
    );
  }
}
