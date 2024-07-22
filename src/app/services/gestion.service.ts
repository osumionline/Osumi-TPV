import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BackupResult, StatusResult } from '@interfaces/interfaces';
import Empleado from '@model/tpv/empleado.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class GestionService {
  private http: HttpClient = inject(HttpClient);

  empleado: Empleado = null;

  getBackups(backupApiKey: string): Observable<BackupResult> {
    return this.http.post<BackupResult>(
      environment.backupApiUrl + '/get-backups',
      { api_key: backupApiKey }
    );
  }

  newBackup(): Observable<StatusResult> {
    return this.http.post<StatusResult>(environment.apiUrl + '/new-backup', {});
  }

  deleteBackup(backupApiKey: string, id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.backupApiUrl + '/delete-account-backup',
      { api_key: backupApiKey, id }
    );
  }
}
