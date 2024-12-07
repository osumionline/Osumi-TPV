import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import {
  AddCaducidadInterface,
  BuscadorCaducidadesInterface,
  BuscadorCaducidadResult,
} from '@interfaces/caducidad.interface';
import { Month, StatusResult } from '@interfaces/interfaces';
import Caducidad from '@model/almacen/caducidad.model';
import FixedNumberPipe from '@modules/shared/pipes/fixed-number.pipe';
import { DialogService, Modal, OverlayService } from '@osumi/angular-tools';
import ArticulosService from '@services/articulos.service';
import CaducidadesService from '@services/caducidades.service';
import ClassMapperService from '@services/class-mapper.service';
import ConfigService from '@services/config.service';
import MarcasService from '@services/marcas.service';
import CaducidadModalComponent from '../modals/caducidad-modal/caducidad-modal.component';

@Component({
  selector: 'otpv-caducidades',
  imports: [
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInput,
    MatIcon,
    MatButton,
    MatIconButton,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltip,
    FixedNumberPipe,
  ],
  templateUrl: './caducidades.component.html',
  styleUrl: './caducidades.component.scss',
})
export default class CaducidadesComponent implements OnInit, OnDestroy {
  private config: ConfigService = inject(ConfigService);
  public ms: MarcasService = inject(MarcasService);
  private cs: CaducidadesService = inject(CaducidadesService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private ars: ArticulosService = inject(ArticulosService);
  private router: Router = inject(Router);
  private overlayService: OverlayService = inject(OverlayService);
  private dialog: DialogService = inject(DialogService);

  buscador: WritableSignal<BuscadorCaducidadesInterface> = signal({
    year: null,
    month: null,
    pagina: 1,
    num: 50,
    idMarca: null,
    nombre: null,
    orderBy: null,
    orderSent: null,
  });
  monthList: Month[] = [];
  yearList: number[] = [];
  list: WritableSignal<Caducidad[]> = signal<Caducidad[]>([]);
  pags: WritableSignal<number> = signal<number>(0);
  pageIndex: WritableSignal<number> = signal<number>(0);
  totalUnidades: WritableSignal<number> = signal<number>(0);
  totalPVP: WritableSignal<number> = signal<number>(0);
  totalPUC: WritableSignal<number> = signal<number>(0);

  caducidadesDisplayedColumns: string[] = [
    'localizador',
    'marca',
    'nombre',
    'unidades',
    'pvp',
    'puc',
    'opciones',
  ];
  caducidadesDataSource: MatTableDataSource<Caducidad> =
    new MatTableDataSource<Caducidad>();
  sort: Signal<MatSort> = viewChild(MatSort);

  ngOnInit(): void {
    this.monthList = this.config.monthList;
    const d: Date = new Date();
    for (let y: number = d.getFullYear(); y > d.getFullYear() - 5; y--) {
      this.yearList.push(y);
    }
    if (!this.cs.firstLoad) {
      this.buscador.set(this.cs.buscador);
      this.list.set(this.cs.list);
      this.caducidadesDataSource.data = this.list();
      this.pageIndex.set(this.cs.pageIndex);
      this.pags.set(this.cs.pags);
    } else {
      this.buscar();
    }
  }

  resetBuscar(): void {
    this.pageIndex.set(0);
    this.buscador.update(
      (value: BuscadorCaducidadesInterface): BuscadorCaducidadesInterface => {
        value.pagina = 1;
        return value;
      }
    );
    this.buscar();
  }

  buscar(): void {
    this.cs
      .getCaducidades(this.buscador())
      .subscribe((result: BuscadorCaducidadResult): void => {
        const caducidades: Caducidad[] = this.cms.getCaducidades(result.list);
        const marcas = {};
        for (const cad of caducidades) {
          if (!marcas['marca_' + cad.articulo.idMarca]) {
            marcas['marca_' + cad.articulo.idMarca] = this.ms.findById(
              cad.articulo.idMarca
            );
          }
          cad.articulo.marca = marcas['marca_' + cad.articulo.idMarca].nombre;
        }
        this.list.set(caducidades);
        this.caducidadesDataSource.data = caducidades;
        this.pags.set(result.pags);
        this.totalUnidades.set(result.totalUnidades);
        this.totalPVP.set(result.totalPVP);
        this.totalPUC.set(result.totalPUC);

        this.cs.buscador = this.buscador();
        this.cs.list = caducidades;
        this.cs.pags = this.pags();
        this.cs.pageIndex = this.pageIndex();
        this.cs.firstLoad = false;
      });
  }

  addCaducidad(): void {
    const modalCaducidadData: Modal = {
      modalTitle: 'Nueva caducidad',
      modalColor: 'blue',
    };
    const dialog = this.overlayService.open(
      CaducidadModalComponent,
      modalCaducidadData
    );
    dialog.afterClosed$.subscribe((data): void => {
      console.log(data);
      if (data !== null) {
        const cad: AddCaducidadInterface = {
          idArticulo: data.data.articulo.id,
          unidades: data.data.unidades,
        };
        this.cs.addCaducidad(cad).subscribe((result: StatusResult): void => {
          if (result.status === 'ok') {
            this.resetBuscar();
          } else {
            this.dialog.alert({
              title: 'Error',
              content: 'Ocurrió un error al guardar la caducidad',
            });
          }
        });
      }
    });
  }

  cambiarOrden(sort: Sort): void {
    if (sort.direction === '') {
      this.buscador.update(
        (value: BuscadorCaducidadesInterface): BuscadorCaducidadesInterface => {
          value.orderBy = null;
          value.orderSent = null;
          return value;
        }
      );
    } else {
      this.buscador.update(
        (value: BuscadorCaducidadesInterface): BuscadorCaducidadesInterface => {
          value.orderBy = sort.active;
          value.orderSent = sort.direction;
          return value;
        }
      );
    }
    this.buscar();
  }

  goToArticulo(ev: MouseEvent, item: Caducidad): void {
    if (ev) {
      ev.preventDefault();
    }
    this.ars.returnInfo = {
      where: 'almacen',
      id: null,
      extra: null,
    };
    this.ars.newArticulo(item.articulo.localizador);
    this.router.navigate(['/articulos']);
  }

  deleteCaducidad(cad: Caducidad): void {
    this.dialog
      .confirm({
        title: 'Confirmar',
        content: '¿Estás seguro de querer borrar esta caducidad?',
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.confirmDeleteCaducidad(cad);
        }
      });
  }

  confirmDeleteCaducidad(cad: Caducidad): void {
    this.cs.deleteCaducidad(cad.id).subscribe((result: StatusResult): void => {
      if (result.status === 'ok') {
        this.resetBuscar();
      } else {
        this.dialog.alert({
          title: 'Error',
          content: 'Ocurrió un error al borrar la caducidad.',
        });
      }
    });
  }

  changePage(ev: PageEvent): void {
    this.pageIndex.set(ev.pageIndex);
    this.buscador.update(
      (value: BuscadorCaducidadesInterface): BuscadorCaducidadesInterface => {
        value.pagina = ev.pageIndex + 1;
        value.num = ev.pageSize;
        return value;
      }
    );
    this.buscar();
  }

  createReport(): void {
    const data: string = window.btoa(JSON.stringify(this.buscador()));
    window.open('/almacen/caducidades-print/' + data);
  }

  ngOnDestroy(): void {
    this.cs.buscador = this.buscador();
    this.cs.list = this.list();
    this.cs.pags = this.pags();
    this.cs.pageIndex = this.pageIndex();
    this.cs.firstLoad = false;
  }
}
