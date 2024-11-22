import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import {
  BuscadorAlmacenInterface,
  BuscadorAlmacenResult,
} from '@interfaces/almacen.interface';
import InventarioItem from '@model/almacen/inventario-item.model';
import AlmacenService from '@services/almacen.service';
import ClassMapperService from '@services/class-mapper.service';
import FixedNumberPipe from '@shared/pipes/fixed-number.pipe';

@Component({
  selector: 'otpv-inventario-print',
  templateUrl: './inventario-print.component.html',
  styleUrls: ['./inventario-print.component.scss'],
  imports: [FixedNumberPipe, MatTableModule],
})
export default class InventarioPrintComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private as: AlmacenService = inject(AlmacenService);
  private cms: ClassMapperService = inject(ClassMapperService);

  buscador: BuscadorAlmacenInterface | null = null;
  list: InventarioItem[] = [];
  inventarioDisplayedColumns: string[] = [
    'localizador',
    'marca',
    'referencia',
    'nombre',
    'stock',
    'pvp',
    'margen',
  ];
  inventarioDataSource: MatTableDataSource<InventarioItem> =
    new MatTableDataSource<InventarioItem>();
  totalPVP: WritableSignal<number> = signal<number>(0);
  totalPUC: WritableSignal<number> = signal<number>(0);

  constructor() {
    document.body.classList.add('white-bg');
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      const data: string = params.data;
      try {
        const objStr: string = window.atob(data);
        this.buscador = JSON.parse(objStr);
      } catch (error) {
        this.buscador = null;
      }
      if (this.buscador === null) {
        alert('¡Ocurrió un error al obtener los datos!');
      } else {
        this.load();
      }
    });
  }

  load(): void {
    this.buscador.num = null;
    this.as
      .getInventario(this.buscador)
      .subscribe((result: BuscadorAlmacenResult): void => {
        this.list = this.cms.getInventarioItems(result.list);
        this.inventarioDataSource.data = this.list;
        this.totalPVP.set(result.totalPVP);
        this.totalPUC.set(result.totalPUC);

        window.setTimeout((): void => {
          window.print();
        });
      });
  }
}
