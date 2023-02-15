import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BackupResult, StatusResult } from "src/app/interfaces/interfaces";
import { Empleado } from "src/app/model/tpv/empleado.model";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class GestionService {
  empleado: Empleado = null;

  constructor(private http: HttpClient) {}

  getBackups(backupApiKey: string): Observable<BackupResult> {
    return this.http.post<BackupResult>(
      environment.backupApiUrl + "/get-backups",
      { api_key: backupApiKey }
    );
  }

  newBackup(): Observable<StatusResult> {
    return this.http.post<StatusResult>(environment.apiUrl + "/new-backup", {});
  }
}
