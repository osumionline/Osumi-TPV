import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, inject, OnInit, Signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ReservasResult } from '@interfaces/cliente.interface';
import { StatusResult } from '@interfaces/interfaces';
import ApiStatusEnum from '@model/enum/api-status.enum';
import ReservaLinea from '@model/ventas/reserva-linea.model';
import Reserva from '@model/ventas/reserva.model';
import { CustomOverlayRef, DialogService } from '@osumi/angular-tools';
import ClassMapperService from '@services/class-mapper.service';
import ClientesService from '@services/clientes.service';
import FixedNumberPipe from '@shared/pipes/fixed-number.pipe';

@Component({
  selector: 'otpv-reservas-modal',
  templateUrl: './reservas-modal.component.html',
  styleUrls: ['./reservas-modal.component.scss'],
  imports: [
    FormsModule,
    MatSortModule,
    FixedNumberPipe,
    MatTableModule,
    MatCheckbox,
    MatButton,
    MatIconButton,
    MatIcon,
  ],
})
export default class ReservasModalComponent implements OnInit, AfterViewInit {
  private readonly cs: ClientesService = inject(ClientesService);
  private readonly cms: ClassMapperService = inject(ClassMapperService);
  private readonly dialog: DialogService = inject(DialogService);
  private readonly customOverlayRef: CustomOverlayRef = inject(CustomOverlayRef);

  list: Reserva[] = [];
  reservaSelected: Reserva | null = null;

  reservasDisplayedColumns: string[] = ['select', 'fecha', 'cliente', 'importe'];
  reservasDataSource: MatTableDataSource<Reserva> = new MatTableDataSource<Reserva>();
  reservaSelectedDisplayedColumns: string[] = [
    'localizador',
    'marca',
    'articulo',
    'unidades',
    'pvp',
    'descuento',
    'importe',
    'opciones',
  ];
  reservaSelectedDataSource: MatTableDataSource<ReservaLinea> =
    new MatTableDataSource<ReservaLinea>();
  sort: Signal<MatSort> = viewChild.required(MatSort);

  selection: SelectionModel<Reserva> = new SelectionModel<Reserva>(true, []);

  ngOnInit(): void {
    this.loadReservas();
  }

  loadReservas(): void {
    this.cs.getReservas().subscribe((result: ReservasResult): void => {
      this.list = this.cms.getReservas(result.list);
      this.reservasDataSource.data = this.list;
    });
  }

  ngAfterViewInit(): void {
    this.reservasDataSource.sort = this.sort();
  }

  isAllSelected(): boolean {
    const numSelected: number = this.selection.selected.length;
    const numRows: number = this.reservasDataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.reservasDataSource.data.forEach((row: Reserva): boolean | void =>
        this.selection.select(row)
      );
    }
  }

  selectReserva(ind: number): void {
    this.reservaSelected = this.list[ind];
    this.reservaSelectedDataSource.data = this.reservaSelected.lineas;
  }

  deleteLineaReserva(linea: ReservaLinea): void {
    if (this.reservaSelected === null) {
      return;
    }
    if (this.reservaSelected.lineas.length === 1) {
      this.deleteReserva();
    } else {
      this.dialog
        .confirm({
          title: 'Confirmar',
          content: `¿Estás seguro de querer borrar la línea "${linea.nombreArticulo}"?`,
        })
        .subscribe((result: boolean): void => {
          if (result === true) {
            this.confirmDeleteLineaReserva(linea);
          }
        });
    }
  }

  confirmDeleteLineaReserva(linea: ReservaLinea): void {
    this.cs.deleteLineaReserva(linea.id as number).subscribe({
      next: (result: StatusResult): void => {
        if (result.status === ApiStatusEnum.OK) {
          if (this.reservaSelected !== null) {
            const ind: number = this.reservaSelected.lineas.findIndex(
              (x: ReservaLinea): boolean => x.id === linea.id
            );
            this.reservaSelected._totalUnidades = null;
            this.reservaSelected._totalDescuento = null;
            if (this.reservaSelected.total === null) {
              this.reservaSelected.total = 0;
            }
            this.reservaSelected.total -= linea.importe ?? 0;
            this.reservaSelected.lineas.splice(ind, 1);
            this.reservaSelectedDataSource.data = this.reservaSelected.lineas;
          }
        } else {
          this.dialog.alert({
            title: 'Error',
            content: '¡Ocurrió un error al borrar la línea!',
          });
        }
      },
      error: (): void => {
        this.dialog.alert({
          title: 'Error',
          content: '¡Ocurrió un error al borrar la línea!',
        });
      },
    });
  }

  deleteReserva(): void {
    this.dialog
      .confirm({
        title: 'Confirmar',
        content: '¿Estás seguro de querer borrar esta reserva?',
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.confirmDeleteReserva();
        }
      });
  }

  confirmDeleteReserva(): void {
    if (this.reservaSelected !== null) {
      this.cs.deleteReserva(this.reservaSelected.id as number).subscribe({
        next: (result: StatusResult): void => {
          if (result.status === ApiStatusEnum.OK) {
            this.reservaSelected = null;
            this.loadReservas();
          } else {
            this.dialog.alert({
              title: 'Error',
              content: '¡Ocurrió un error al borrar la reserva!',
            });
          }
        },
        error: (): void => {
          this.dialog.alert({
            title: 'Error',
            content: '¡Ocurrió un error al borrar la reserva!',
          });
        },
      });
    }
  }

  cargarVenta(): void {
    this.customOverlayRef.close([this.reservaSelected]);
  }

  cargarVentas(): void {
    let idCliente: number | null = null;
    for (const reserva of this.selection.selected) {
      if (idCliente === null) {
        idCliente = reserva.idCliente;
      }
      if (idCliente !== reserva.idCliente) {
        this.dialog.alert({
          title: 'Error',
          content: 'Las reservas elegidas pertenecen a distintos clientes.',
        });
        return;
      }
    }
    this.customOverlayRef.close(this.selection.selected);
  }
}
