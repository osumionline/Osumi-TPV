import { Injectable } from '@angular/core';
import {
  CierreCajaInterface,
  CierreCajaResult,
  SalidaCajaInterface,
  SalidaCajaResult,
} from '@interfaces/caja.interface';
import {
  AllProvincesInterface,
  AppDataInterface,
  DateValues,
  IdSaveResult,
  StartDataInterface,
  StatusResult,
} from '@interfaces/interfaces';
import {
  TipoPagoInterface,
  TiposPagoOrderInterface,
  TiposPagoResult,
} from '@interfaces/tipo-pago.interface';
import BaseService from '@services/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class ApiService extends BaseService {
  checkStart(): Observable<StartDataInterface> {
    return this.http.post<StartDataInterface>(this.apiUrl + '/check-start', {});
  }

  saveInstallation(data: AppDataInterface): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + '/save-installation', data);
  }

  openBox(): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + '/open-box', {});
  }

  getProvinceList(): Observable<AllProvincesInterface> {
    return this.http.get<AllProvincesInterface>('/provinces.json');
  }

  saveTipoPago(tipoPago: TipoPagoInterface): Observable<IdSaveResult> {
    return this.http.post<IdSaveResult>(this.apiUrl + '/save-tipo-pago', tipoPago);
  }

  loadTiposPago(): Observable<TiposPagoResult> {
    return this.http.post<TiposPagoResult>(this.apiUrl + '/get-tipos-pago', {});
  }

  deleteTipoPago(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + '/delete-tipo-pago', { id });
  }

  saveTipoPagoOrden(orderList: TiposPagoOrderInterface[]): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + '/save-tipo-pago-orden', {
      list: orderList,
    });
  }

  getSalidasCaja(data: DateValues): Observable<SalidaCajaResult> {
    return this.http.post<SalidaCajaResult>(this.apiUrl + '/get-salidas-caja', data);
  }

  saveSalidaCaja(data: SalidaCajaInterface): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + '/save-salida-caja', data);
  }

  deleteSalidaCaja(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + '/delete-salida-caja', { id });
  }

  getCierreCaja(date: string): Observable<CierreCajaResult> {
    return this.http.post<CierreCajaResult>(this.apiUrl + '/get-cierre-caja', { date });
  }

  saveCierreCaja(data: CierreCajaInterface): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + '/cerrar-caja', data);
  }
}
