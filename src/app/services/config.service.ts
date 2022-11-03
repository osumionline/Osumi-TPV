import { Injectable } from "@angular/core";
import {
  AppDataResult,
  Month,
  ProvinceInterface,
} from "src/app/interfaces/interfaces";
import { IVAOption } from "src/app/model/iva-option.model";
import { TipoPago } from "src/app/model/tipo-pago.model";
import { ApiService } from "src/app/services/api.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ClientesService } from "src/app/services/clientes.service";
import { EmpleadosService } from "src/app/services/empleados.service";
import { MarcasService } from "src/app/services/marcas.service";
import { ProveedoresService } from "src/app/services/proveedores.service";

@Injectable({
  providedIn: "root",
})
export class ConfigService {
  status: string = "new";

  nombre: string = "";
  cif: string = "";
  telefono: string = "";
  direccion: string = "";
  email: string = "";
  twitter: string = "";
  facebook: string = "";
  instagram: string = "";
  web: string = "";
  tipoIva: string = "";
  ivaOptions: IVAOption[] = [];
  marginList: number[] = [];
  ventaOnline: boolean = false;
  urlApi: string = "";
  fechaCad: boolean = false;
  empleados: boolean = false;

  tiposPago: TipoPago[] = [];
  isOpened: boolean = false;
  idEmpleadoDef: number = null;
  colorEmpleadoDef: string = "#fff";
  colorTextEmpleadoDef: string = "#000";

  monthList: Month[] = [
    { id: 1, name: "Enero", days: 31 },
    { id: 2, name: "Febrero", days: 28 },
    { id: 3, name: "Marzo", days: 31 },
    { id: 4, name: "Abril", days: 30 },
    { id: 5, name: "Mayo", days: 31 },
    { id: 6, name: "Junio", days: 30 },
    { id: 7, name: "Julio", days: 31 },
    { id: 8, name: "Agosto", days: 31 },
    { id: 9, name: "Septiembre", days: 30 },
    { id: 10, name: "Octubre", days: 31 },
    { id: 11, name: "Noviembre", days: 30 },
    { id: 12, name: "Diciembre", days: 31 },
  ];

  provincias: ProvinceInterface[] = [];

  constructor(
    private as: ApiService,
    private cms: ClassMapperService,
    private ms: MarcasService,
    private ps: ProveedoresService,
    private es: EmpleadosService,
    private cs: ClientesService
  ) {}

  start(): Promise<string> {
    return new Promise((resolve) => {
      if (this.status === "loaded") {
        resolve(this.status);
      } else {
        const d: Date = new Date();
        const date: string =
          d.getFullYear() +
          "-" +
          (d.getMonth() + 1 < 10
            ? "0" + (d.getMonth() + 1)
            : d.getMonth() + 1) +
          "-" +
          (d.getDate() < 10 ? "0" + d.getDate() : d.getDate());
        this.as.checkStart(date).subscribe((result) => {
          if (result.appData === null) {
            this.status = "install";
            resolve(this.status);
          } else {
            this.load(result.appData);
            this.tiposPago = this.cms.getTiposPago(result.tiposPago);
            this.isOpened = result.opened;
            this.status = "loaded";
            const marcasPromise: Promise<string> = this.ms.load();
            const proveedoresPromise: Promise<string> = this.ps.load();
            const empleadosPromise: Promise<string> = this.es.load();
            const clientesPromise: Promise<string> = this.cs.load();
            const provinciasPromise: Promise<string> = this.loadProvinces();
            Promise.all([
              marcasPromise,
              proveedoresPromise,
              empleadosPromise,
              clientesPromise,
              provinciasPromise,
            ]).then((values) => {
              if (this.es.empleados.length == 1) {
                this.empleados = false;
                this.idEmpleadoDef = this.es.empleados[0].id;
                this.colorEmpleadoDef = this.es.colors[this.idEmpleadoDef];
                this.colorTextEmpleadoDef =
                  this.es.textColors[this.idEmpleadoDef];
              }
              resolve(this.status);
            });
          }
        });
      }
    });
  }

  load(data: AppDataResult): void {
    this.nombre = data.nombre;
    this.cif = data.cif;
    this.telefono = data.telefono;
    this.email = data.email;
    this.direccion = data.direccion;
    this.twitter = data.twitter;
    this.facebook = data.facebook;
    this.instagram = data.instagram;
    this.web = data.web;
    this.tipoIva = data.tipoIva;
    for (let i in data.ivaList) {
      if (this.tipoIva === "iva") {
        this.ivaOptions.push(new IVAOption(this.tipoIva, data.ivaList[i]));
      } else {
        this.ivaOptions.push(
          new IVAOption(this.tipoIva, data.ivaList[i], data.reList[i])
        );
      }
    }
    this.marginList = data.marginList;
    this.ventaOnline = data.ventaOnline;
    this.urlApi = data.urlApi;
    this.fechaCad = data.fechaCad;
    this.empleados = data.empleados;
  }

  loadProvinces(): Promise<string> {
    return new Promise((resolve) => {
      if (this.provincias.length > 0) {
        resolve("ok");
      } else {
        this.as.getProvinceList().subscribe((data) => {
          let newList = [];
          for (let ccaa of data.ccaa) {
            newList = newList.concat(ccaa.provinces);
          }
          newList.sort(function (a, b) {
            return a.name.localeCompare(b.name);
          });

          this.provincias = newList;
          resolve("ok");
        });
      }
    });
  }
}
