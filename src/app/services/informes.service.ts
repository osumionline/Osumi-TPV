import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { InformeMensualResult } from "src/app/interfaces/informes.interface";
import { StatusResult } from "src/app/interfaces/interfaces";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class InformesService {
  constructor(private http: HttpClient) {}

  getInformeCierreCajaMensual(
    month: number,
    year: number
  ): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + "-informes/get-informe-cierre-caja-mensual",
      { month, year }
    );
  }

  getInformeMensual(
    month: number,
    year: number
  ): Observable<InformeMensualResult> {
    return this.http.post<InformeMensualResult>(
      environment.apiUrl + "-informes/get-informe-mensual",
      { month, year }
    );
  }
}
