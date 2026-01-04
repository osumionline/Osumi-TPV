import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BackupResult, StatusResult } from '@interfaces/interfaces';
import Empleado from '@model/tpv/empleado.model';
import BaseService from '@services/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class GestionService extends BaseService {
  empleado: Empleado | null = null;

  getBackups(backupApiKey: string): Observable<BackupResult> {
    return this.http.post<BackupResult>(environment.backupApiUrl + '/get-backups', {
      api_key: backupApiKey,
    });
  }

  newBackup(): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + '/new-backup', {});
  }

  deleteBackup(backupApiKey: string, id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(environment.backupApiUrl + '/delete-account-backup', {
      api_key: backupApiKey,
      id,
    });
  }
}
