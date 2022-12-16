import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  CierreCajaInterface,
  CierreCajaResult,
  SalidaCajaInterface,
  SalidaCajaResult,
} from "src/app/interfaces/caja.interface";
import {
  AllProvincesInterface,
  AppDataInterface,
  DateValues,
  IdSaveResult,
  StartDataInterface,
  StatusResult,
} from "src/app/interfaces/interfaces";
import {
  TipoPagoInterface,
  TiposPagoOrderInterface,
  TiposPagoResult,
} from "src/app/interfaces/tipo-pago.interface";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private http: HttpClient) {}

  checkStart(date: string): Observable<StartDataInterface> {
    return this.http.post<StartDataInterface>(
      environment.apiUrl + "/check-start",
      { date }
    );
  }

  saveInstallation(data: AppDataInterface): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + "/save-installation",
      data
    );
  }

  openBox(): Observable<StatusResult> {
    return this.http.post<StatusResult>(environment.apiUrl + "/open-box", {});
  }

  getProvinceList(): Observable<AllProvincesInterface> {
    return this.http.get<AllProvincesInterface>("/assets/provinces.json");
  }

  saveTipoPago(tipoPago: TipoPagoInterface): Observable<IdSaveResult> {
    return this.http.post<IdSaveResult>(
      environment.apiUrl + "/save-tipo-pago",
      tipoPago
    );
  }

  loadTiposPago(): Observable<TiposPagoResult> {
    return this.http.post<TiposPagoResult>(
      environment.apiUrl + "/get-tipos-pago",
      {}
    );
  }

  deleteTipoPago(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + "/delete-tipo-pago",
      { id }
    );
  }

  saveTipoPagoOrden(
    orderList: TiposPagoOrderInterface[]
  ): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + "/save-tipo-pago-orden",
      { list: orderList }
    );
  }

  getSalidasCaja(data: DateValues): Observable<SalidaCajaResult> {
    return this.http.post<SalidaCajaResult>(
      environment.apiUrl + "/get-salidas-caja",
      data
    );
  }

  saveSalidaCaja(data: SalidaCajaInterface): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + "/save-salida-caja",
      data
    );
  }

  deleteSalidaCaja(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + "/delete-salida-caja",
      { id }
    );
  }

  getCierreCaja(date: string): Observable<CierreCajaResult> {
    return this.http.post<CierreCajaResult>(
      environment.apiUrl + "/get-cierre-caja",
      { date }
    );
  }

  saveCierreCaja(data: CierreCajaInterface): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + "/cerrar-caja",
      data
    );
  }
}
