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
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Modal } from '@app/interfaces/modals.interface';
import {
  BuscadorCaducidadesInterface,
  BuscadorCaducidadResult,
} from '@interfaces/caducidad.interface';
import { Month } from '@interfaces/interfaces';
import Caducidad from '@model/almacen/caducidad.model';
import FixedNumberPipe from '@modules/shared/pipes/fixed-number.pipe';
import ArticulosService from '@services/articulos.service';
import CaducidadesService from '@services/caducidades.service';
import ClassMapperService from '@services/class-mapper.service';
import ConfigService from '@services/config.service';
import MarcasService from '@services/marcas.service';
import OverlayService from '@services/overlay.service';
import CaducidadModalComponent from '../modals/caducidad-modal/caducidad-modal.component';

@Component({
  selector: 'otpv-caducidades',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInput,
    MatIcon,
    MatButton,
    FormsModule,
    MatTableModule,
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
        this.list.set(this.cms.getCaducidades(result.list));
        this.caducidadesDataSource.data = this.list();
        this.pags.set(result.pags);
        this.totalUnidades.set(result.totalUnidades);
        this.totalPVP.set(result.totalPVP);
        this.totalPUC.set(result.totalPUC);

        this.cs.buscador = this.buscador();
        this.cs.list = this.list();
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
      if (data !== null) {
        this.buscar();
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
    ev && ev.preventDefault();
    this.ars.returnInfo = {
      where: 'almacen',
      id: null,
      extra: null,
    };
    this.ars.newArticulo(item.articulo.localizador);
    this.router.navigate(['/articulos']);
  }

  deleteCaducidad(cad: Caducidad): void {
    console.log(cad);
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

  createReport(): void {}

  ngOnDestroy(): void {
    this.cs.buscador = this.buscador();
    this.cs.list = this.list();
    this.cs.pags = this.pags();
    this.cs.pageIndex = this.pageIndex();
    this.cs.firstLoad = false;
  }
}
