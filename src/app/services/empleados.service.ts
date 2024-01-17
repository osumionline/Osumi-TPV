import { HttpClient } from "@angular/common/http";
import { Injectable, WritableSignal, signal } from "@angular/core";
import { Observable } from "rxjs";
import {
  EmpleadoLoginInterface,
  EmpleadoSaveInterface,
  EmpleadosResult,
} from "src/app/interfaces/empleado.interface";
import { StatusResult } from "src/app/interfaces/interfaces";
import { Empleado } from "src/app/model/tpv/empleado.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class EmpleadosService {
  empleados: WritableSignal<Empleado[]> = signal<Empleado[]>([]);
  colors: any = {};
  textColors: any = {};
  loaded: boolean = false;

  constructor(private http: HttpClient, private cms: ClassMapperService) {}

  load(): Promise<string> {
    return new Promise((resolve) => {
      if (this.loaded) {
        resolve("ok");
      } else {
        this.getEmpleados().subscribe((result: EmpleadosResult): void => {
          this.loadEmpleados(this.cms.getEmpleados(result.list));
          resolve("ok");
        });
      }
    });
  }

  getEmpleados(): Observable<EmpleadosResult> {
    return this.http.post<EmpleadosResult>(
      environment.apiUrl + "-empleados/get-empleados",
      {}
    );
  }

  loadEmpleados(empleados: Empleado[]): void {
    this.empleados.set(empleados);
    for (const e of empleados) {
      this.colors[e.id] = e.color;
      this.textColors[e.id] = e.textColor;
    }
    this.loaded = true;
  }

  resetEmpleados(): void {
    this.loaded = false;
    this.load();
  }

  saveEmpleado(empleado: EmpleadoSaveInterface): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + "-empleados/save-empleado",
      empleado
    );
  }

  login(empleado: EmpleadoLoginInterface): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + "-empleados/login",
      empleado
    );
  }

  deleteEmpleado(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + "-empleados/delete-empleado",
      { id }
    );
  }
}
