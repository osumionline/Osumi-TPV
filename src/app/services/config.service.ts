import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  AllProvincesInterface,
  AppDataResult,
  Month,
  ProvinceInterface,
} from '@interfaces/interfaces';
import ApiStatusEnum from '@model/enum/api-status.enum';
import IVAOption from '@model/tpv/iva-option.model';
import TipoPago from '@model/tpv/tipo-pago.model';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import ClientesService from '@services/clientes.service';
import EmpleadosService from '@services/empleados.service';
import MarcasService from '@services/marcas.service';
import ProveedoresService from '@services/proveedores.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class ConfigService {
  private readonly title: Title = inject(Title);
  private readonly apiService: ApiService = inject(ApiService);
  private readonly cms: ClassMapperService = inject(ClassMapperService);
  private readonly marcasService: MarcasService = inject(MarcasService);
  private readonly proveedoresService: ProveedoresService = inject(ProveedoresService);
  private readonly empleadosService: EmpleadosService = inject(EmpleadosService);
  private readonly clientesService: ClientesService = inject(ClientesService);

  status: string = 'new';

  nombre: string = '';
  nombreComercial: string = '';
  cif: string = '';
  telefono: string = '';
  direccion: string = '';
  poblacion: string = '';
  email: string = '';
  twitter: string = '';
  facebook: string = '';
  instagram: string = '';
  web: string = '';
  cajaInicial: number = 0;
  ticketInicial: number = 1;
  facturaInicial: number = 1;
  tipoIva: string = '';
  ivaOptions: IVAOption[] = [];
  marginList: number[] = [];
  ventaOnline: boolean = false;
  urlApi: string = '';
  secretApi: string = '';
  backupApiKey: string = '';
  fechaCad: boolean = false;
  empleados: boolean = false;

  tiposPago: TipoPago[] = [];
  isOpened: boolean = false;
  idEmpleadoDef: number | null = null;
  colorEmpleadoDef: string | null = '#fff';
  colorTextEmpleadoDef: string | null = '#000';

  monthList: Month[] = [
    { id: 1, name: 'Enero', days: 31 },
    { id: 2, name: 'Febrero', days: 28 },
    { id: 3, name: 'Marzo', days: 31 },
    { id: 4, name: 'Abril', days: 30 },
    { id: 5, name: 'Mayo', days: 31 },
    { id: 6, name: 'Junio', days: 30 },
    { id: 7, name: 'Julio', days: 31 },
    { id: 8, name: 'Agosto', days: 31 },
    { id: 9, name: 'Septiembre', days: 30 },
    { id: 10, name: 'Octubre', days: 31 },
    { id: 11, name: 'Noviembre', days: 30 },
    { id: 12, name: 'Diciembre', days: 31 },
  ];

  provincias: WritableSignal<ProvinceInterface[]> = signal<ProvinceInterface[]>([]);

  start(): Promise<string> {
    return new Promise((resolve) => {
      if (this.status === ApiStatusEnum.LOADED) {
        resolve(this.status);
      } else {
        this.apiService.checkStart().subscribe((result) => {
          if (result.appData === null) {
            this.status = 'install';
            resolve(this.status);
          } else {
            this.load(result.appData);
            this.tiposPago = this.cms.getTiposPago(result.tiposPago);
            this.isOpened = result.opened;
            this.status = 'loaded';
            const marcasPromise: Promise<string> = this.marcasService.load();
            const proveedoresPromise: Promise<string> = this.proveedoresService.load();
            const empleadosPromise: Promise<string> = this.empleadosService.load();
            const clientesPromise: Promise<string> = this.clientesService.load();
            const provinciasPromise: Promise<string> = this.loadProvinces();
            Promise.all([
              marcasPromise,
              proveedoresPromise,
              empleadosPromise,
              clientesPromise,
              provinciasPromise,
            ]).then((): void => {
              if (this.empleadosService.empleados().length == 1) {
                this.empleados = false;
                this.idEmpleadoDef = this.empleadosService.empleados()[0].id;
                this.colorEmpleadoDef = this.empleadosService.colors[this.idEmpleadoDef as number];
                this.colorTextEmpleadoDef =
                  this.empleadosService.textColors[this.idEmpleadoDef as number];
              }
              resolve(this.status);
            });
          }
        });
      }
    });
  }

  load(data: AppDataResult): void {
    this.title.setTitle(data.nombre);
    this.nombre = data.nombre;
    this.nombreComercial = data.nombreComercial;
    this.cif = data.cif;
    this.telefono = data.telefono;
    this.email = data.email;
    this.direccion = data.direccion;
    this.poblacion = data.poblacion;
    this.twitter = data.twitter;
    this.facebook = data.facebook;
    this.instagram = data.instagram;
    this.web = data.web;
    this.cajaInicial = data.cajaInicial;
    this.ticketInicial = data.ticketInicial;
    this.facturaInicial = data.facturaInicial;
    this.tipoIva = data.tipoIva;
    for (const i in data.ivaList) {
      if (this.tipoIva === 'iva') {
        this.ivaOptions.push(new IVAOption(this.tipoIva, data.ivaList[i]));
      } else {
        this.ivaOptions.push(new IVAOption(this.tipoIva, data.ivaList[i], data.reList[i]));
      }
    }
    this.marginList = data.marginList;
    this.ventaOnline = data.ventaOnline;
    this.urlApi = data.urlApi;
    this.secretApi = data.secretApi;
    this.backupApiKey = data.backupApiKey;
    this.fechaCad = data.fechaCad;
    this.empleados = data.empleados;
  }

  loadProvinces(): Promise<string> {
    return new Promise((resolve) => {
      if (this.provincias.length > 0) {
        resolve('ok');
      } else {
        this.apiService.getProvinceList().subscribe((data: AllProvincesInterface): void => {
          let newList: ProvinceInterface[] = [];
          for (const ccaa of data.ccaa) {
            newList = newList.concat(ccaa.provinces);
          }
          newList.sort(function (a: ProvinceInterface, b: ProvinceInterface): number {
            return a.name.localeCompare(b.name);
          });

          this.provincias.set(newList);
          resolve('ok');
        });
      }
    });
  }

  findIVAOptionByIVA(iva: number): IVAOption {
    const ind: number = this.ivaOptions.findIndex((x: IVAOption): boolean => {
      return x.iva === iva;
    });
    return new IVAOption(
      this.ivaOptions[ind].tipoIVA,
      this.ivaOptions[ind].iva,
      this.ivaOptions[ind].re
    );
  }

  findIVAOptionById(id: string): IVAOption {
    const ind: number = this.ivaOptions.findIndex((x: IVAOption): boolean => {
      return x.id === id;
    });
    return new IVAOption(
      this.ivaOptions[ind].tipoIVA,
      this.ivaOptions[ind].iva,
      this.ivaOptions[ind].re
    );
  }

  public isBoxOpened(): Observable<boolean> {
    return of(this.isOpened);
  }
}
