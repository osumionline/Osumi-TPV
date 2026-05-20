import {
  Component,
  OutputEmitterRef,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { MatNativeDateModule, MatOption, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import ApiStatusEnum from '@enum/api-status.enum';
import { environment } from '@env/environment';
import { HistoricoVentasResult, VentaHistoricoOtrosInterface } from '@interfaces/caja.interface';
import { DateValues, IdSaveResult, StatusResult } from '@interfaces/interfaces';
import VentaHistorico from '@model/caja/venta-historico.model';
import VentaLineaHistorico from '@model/caja/venta-linea-historico.model';
import Cliente from '@model/clientes/cliente.model';
import TipoPago from '@model/tpv/tipo-pago.model';
import { DialogField, DialogService } from '@osumi/angular-tools';
import { addDays, getDate, urlencode } from '@osumi/tools';
import ClassMapperService from '@services/class-mapper.service';
import ClientesService from '@services/clientes.service';
import ConfigService from '@services/config.service';
import VentasService from '@services/ventas.service';
import FixedNumberPipe from '@shared/pipes/fixed-number.pipe';

type HistoricoModo = 'fecha' | 'rango';
type TicketTipo = 'venta' | 'regalo';

@Component({
  selector: 'otpv-historico-ventas',
  templateUrl: './historico-ventas.component.html',
  styleUrls: ['./historico-ventas.component.scss'],
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    MatSortModule,
    FixedNumberPipe,
    MatFormFieldModule,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    MatButton,
    MatFabButton,
    MatIconButton,
    MatIcon,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatTooltip,
  ],
})
export default class HistoricoVentasComponent {
  private readonly vs: VentasService = inject(VentasService);
  private readonly cms: ClassMapperService = inject(ClassMapperService);
  private readonly cs: ClientesService = inject(ClientesService);
  private readonly config: ConfigService = inject(ConfigService);
  private readonly dialog: DialogService = inject(DialogService);
  private readonly router: Router = inject(Router);

  cerrarVentanaEvent: OutputEmitterRef<number> = output<number>();
  historicoModo: WritableSignal<HistoricoModo> = signal<HistoricoModo>('fecha');
  fecha: WritableSignal<Date> = signal<Date>(new Date());
  rangoDesde: WritableSignal<Date> = signal<Date>(new Date());
  rangoHasta: WritableSignal<Date> = signal<Date>(new Date());

  tiposPago: WritableSignal<TipoPago[]> = signal<TipoPago[]>([...this.config.tiposPago]);
  clientes: Signal<Cliente[]> = this.cs.clientes;

  historicoVentasList: WritableSignal<VentaHistorico[]> = signal<VentaHistorico[]>([]);
  historicoVentasDisplayedColumns: string[] = ['fecha', 'total', 'nombreTipoPago'];
  historicoVentasDataSource: MatTableDataSource<VentaHistorico> =
    new MatTableDataSource<VentaHistorico>();
  ventasSort: Signal<MatSort | undefined> = viewChild<MatSort>('ventasSort');

  totalDia: WritableSignal<number> = signal<number>(0);
  ventasEfectivo: WritableSignal<number> = signal<number>(0);
  ventasOtros: WritableSignal<VentaHistoricoOtrosInterface[]> = signal<
    VentaHistoricoOtrosInterface[]
  >([]);
  ventasWeb: WritableSignal<number> = signal<number>(0);
  ventasBeneficio: WritableSignal<number> = signal<number>(0);
  ticketMedio: Signal<number> = computed((): number => {
    const ventas: VentaHistorico[] = this.historicoVentasList();

    if (ventas.length === 0) {
      return 0;
    }

    const totalVentas: number = ventas.reduce(
      (total: number, venta: VentaHistorico): number => total + (venta.total ?? 0),
      0,
    );

    return totalVentas / ventas.length;
  });

  historicoVentasSelected: WritableSignal<VentaHistorico | null> = signal<VentaHistorico | null>(
    null,
    { equal: (): boolean => false },
  );
  historicoVentasSelectedDisplayedColumns: string[] = [
    'localizador',
    'marca',
    'articulo',
    'unidades',
    'pvp',
    'descuento',
    'importe',
  ];
  historicoVentasSelectedDataSource: MatTableDataSource<VentaLineaHistorico> =
    new MatTableDataSource<VentaLineaHistorico>();
  lineasSort: Signal<MatSort | undefined> = viewChild<MatSort>('lineasSort');
  syncTableSorts = effect((): void => {
    const ventasSort: MatSort | undefined = this.ventasSort();
    const lineasSort: MatSort | undefined = this.lineasSort();

    if (ventasSort !== undefined) {
      this.historicoVentasDataSource.sort = ventasSort;
    }

    if (lineasSort !== undefined) {
      this.historicoVentasSelectedDataSource.sort = lineasSort;
    }
  });

  clientesBox: Signal<MatSelect | undefined> = viewChild<MatSelect>('clientesBox');

  changeHistoricoModo(modo: HistoricoModo): void {
    this.historicoModo.set(modo);
  }

  changeFechaValue(fecha: Date): void {
    this.fecha.set(fecha);
    this.changeFecha();
  }

  changeRangoDesde(fecha: Date): void {
    this.rangoDesde.set(fecha);
  }

  changeRangoHasta(fecha: Date): void {
    this.rangoHasta.set(fecha);
  }

  previousFecha(): void {
    this.fecha.update((fecha: Date): Date => addDays(fecha, -1));
    this.changeFecha();
  }

  nextFecha(): void {
    this.fecha.update((fecha: Date): Date => addDays(fecha, 1));
    this.changeFecha();
  }

  changeFecha(): void {
    this.clearSelectedVenta();
    const data: DateValues = {
      modo: 'fecha',
      id: null,
      fecha: getDate(this.fecha()),
      desde: null,
      hasta: null,
    };
    this.buscarHistorico(data);
  }

  buscarPorRango(): void {
    if (this.rangoDesde().getTime() > this.rangoHasta().getTime()) {
      this.dialog.alert({
        title: 'Error',
        content: 'La fecha "desde" no puede ser superior a la fecha "hasta"',
      });
      return;
    }
    const data: DateValues = {
      modo: 'rango',
      fecha: null,
      id: null,
      desde: getDate(this.rangoDesde()),
      hasta: getDate(this.rangoHasta()),
    };
    this.buscarHistorico(data);
  }

  buscarHistorico(data: DateValues): void {
    this.vs.getHistorico(data).subscribe((result: HistoricoVentasResult): void => {
      const ventas: VentaHistorico[] = this.cms.getHistoricoVentas(result.list);
      this.historicoVentasList.set(ventas);
      this.historicoVentasDataSource.data = ventas;

      this.totalDia.set(result.totalDia);
      this.ventasEfectivo.set(result.ventasEfectivo);
      this.ventasOtros.set(result.ventasOtros);
      this.ventasWeb.set(result.ventasWeb);
      this.ventasBeneficio.set(result.ventasBeneficio);
    });
  }

  selectVenta(ind: number): void {
    const venta: VentaHistorico | undefined = this.historicoVentasList()[ind];
    if (venta === undefined) {
      this.clearSelectedVenta();
      return;
    }

    this.historicoVentasSelected.set(venta);
    this.historicoVentasSelectedDataSource.data = venta.lineas;
  }

  changeCliente(idCliente: number | null): void {
    const venta: VentaHistorico | null = this.historicoVentasSelected();
    if (venta === null || venta.id === null) {
      return;
    }

    venta.idCliente = idCliente;
    this.refreshSelectedVenta();
    this.cs
      .asignarCliente(venta.id, idCliente as number)
      .subscribe((result: StatusResult): void => {
        if (result.status === ApiStatusEnum.OK) {
          const cliente: Cliente | undefined = this.cs
            .clientes()
            .find((x: Cliente): boolean => x.id === venta.idCliente);
          if (cliente !== undefined) {
            venta.cliente = cliente.nombreApellidos;
          } else {
            venta.cliente = null;
          }
          this.refreshSelectedVenta();
        }
      });
  }

  changeFormaPago(tipoPago: number): void {
    const venta: VentaHistorico | null = this.historicoVentasSelected();
    if (venta === null || venta.id === null) {
      return;
    }

    venta.tipoPago = tipoPago;
    this.refreshSelectedVenta();
    this.vs
      .asignarTipoPago(venta.id, venta.idTipoPago as number)
      .subscribe((result: StatusResult): void => {
        if (result.status === ApiStatusEnum.OK) {
          if (venta.idTipoPago !== null) {
            const tp: TipoPago | undefined = this.config.tiposPago.find(
              (x: TipoPago): boolean => x.id === venta.idTipoPago,
            );
            if (tp !== undefined) {
              venta.nombreTipoPago = tp.nombre;
            }
          } else {
            venta.nombreTipoPago = 'Efectivo';
          }
          this.refreshSelectedVenta();
        }
      });
  }

  printTicket(tipo: TicketTipo): void {
    const venta: VentaHistorico | null = this.historicoVentasSelected();
    if (venta === null || venta.id === null) {
      return;
    }

    this.vs.printTicket(venta.id, tipo).subscribe((result: StatusResult): void => {
      if (result.status === ApiStatusEnum.ERROR) {
        this.dialog.alert({
          title: 'Error',
          content: 'Ocurrió un error al imprimir el ticket.',
        });
      }
    });
  }

  getTicketImage(): void {
    const venta: VentaHistorico | null = this.historicoVentasSelected();
    if (venta === null || venta.id === null) {
      return;
    }

    window.open(environment.baseUrl + 'api-ventas/get-ticket-image/' + venta.id);
  }

  generarFactura(): void {
    const venta: VentaHistorico | null = this.historicoVentasSelected();
    if (venta === null) {
      return;
    }

    if (venta.idCliente === null) {
      this.dialog
        .confirm({
          title: 'Cliente',
          content:
            'Esta venta no tiene ningún cliente asignado, ¿quieres elegir uno o crear uno nuevo?',
          ok: 'Crear nuevo',
          cancel: 'Elegir cliente',
        })
        .subscribe((result: boolean): void => {
          if (result === true) {
            this.cerrarVentanaEvent.emit(0);
            this.router.navigate(['/clientes/new']);
          } else {
            setTimeout((): void => {
              this.clientesBox()?.toggle();
            }, 0);
          }
        });
    } else {
      this.confirmFactura();
    }
  }

  confirmFactura(): void {
    const venta: VentaHistorico | null = this.historicoVentasSelected();
    if (venta === null || venta.idCliente === null) {
      return;
    }

    const selectedClient: Cliente | null = this.cs.findById(venta.idCliente);

    if (selectedClient !== null) {
      if (selectedClient.dniCif === null || selectedClient.dniCif === '') {
        this.dialog.alert({
          title: 'Error',
          content:
            'El cliente "' +
            selectedClient.nombreApellidos +
            '" no tiene DNI/CIF introducido por lo que no se le puede crear una factura.',
        });
      } else {
        if (
          selectedClient.direccion === null ||
          selectedClient.direccion === '' ||
          selectedClient.codigoPostal === null ||
          selectedClient.codigoPostal === '' ||
          selectedClient.poblacion === null ||
          selectedClient.poblacion === '' ||
          selectedClient.provincia === null
        ) {
          this.dialog
            .confirm({
              title: 'Confirmar',
              content:
                'El cliente "' +
                selectedClient.nombreApellidos +
                '" no tiene dirección introducida. ¿Quieres continuar?',
            })
            .subscribe((result: boolean): void => {
              if (result === true) {
                this.saveFacturaFromVenta();
              }
            });
        } else {
          this.saveFacturaFromVenta();
        }
      }
    }
  }

  saveFacturaFromVenta(): void {
    const venta: VentaHistorico | null = this.historicoVentasSelected();
    if (venta === null || venta.id === null) {
      return;
    }

    this.cs.saveFacturaFromVenta(venta.id).subscribe((result: IdSaveResult): void => {
      if (result.status === ApiStatusEnum.OK || result.status === ApiStatusEnum.ERROR_FACTURA) {
        window.open('/clientes/factura/' + result.id + '/preview');
      }
      if (result.status === ApiStatusEnum.ERROR_FACTURADA) {
        window.open('/clientes/factura/' + result.id);
      }
    });
  }

  enviarEmail(): void {
    const venta: VentaHistorico | null = this.historicoVentasSelected();
    if (venta === null || venta.id === null) {
      return;
    }

    if (venta.idCliente === null) {
      this.dialog
        .confirm({
          title: 'Cliente',
          content:
            'Esta venta no tiene ningún cliente asignado, ¿quieres elegir uno o introducir uno manualmente?',
          ok: 'Elegir cliente',
          cancel: 'Introducir email',
        })
        .subscribe((result: boolean): void => {
          if (result === true) {
            setTimeout((): void => {
              this.clientesBox()?.toggle();
            }, 0);
          } else {
            this.pedirEmail();
          }
        });
    } else {
      const cliente: Cliente | null = this.cs.findById(venta.idCliente);
      if (cliente !== null) {
        if (cliente.email === null || cliente.email === '') {
          this.dialog
            .confirm({
              title: 'Enviar email',
              content:
                'El cliente seleccionado no tiene una dirección de email asignada, ¿quieres ir a su ficha o introducir uno manualmente?',
              ok: 'Ir a su ficha',
              cancel: 'Introducir email',
            })
            .subscribe((result: boolean): void => {
              if (result === true) {
                this.router.navigate(['/clientes/' + cliente.id]);
              } else {
                this.pedirEmail();
              }
            });
        } else {
          this.sendTicket(venta.id, cliente.email);
        }
      }
    }
  }

  pedirEmail(): void {
    const venta: VentaHistorico | null = this.historicoVentasSelected();
    if (venta === null || venta.id === null) {
      return;
    }

    this.dialog
      .form({
        title: 'Introducir email',
        content: 'Introduce el email del cliente',
        fields: [{ title: 'Email', type: 'email', value: '', required: true }],
      })
      .subscribe((result: DialogField[]): void => {
        if (result !== undefined && result.length > 0) {
          this.sendTicket(venta.id as number, result[0].value);
        }
      });
  }

  sendTicket(id: number, email: string): void {
    this.dialog
      .confirm({
        title: 'Enviar email',
        content: 'Se enviará el ticket al email "' + email + '", ¿quieres continuar?',
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.sendTicketConfirm(id, email);
        }
      });
  }

  sendTicketConfirm(id: number, email: string): void {
    this.vs.sendTicket(id, urlencode(email) as string).subscribe((result: StatusResult): void => {
      if (result.status === ApiStatusEnum.OK) {
        this.dialog.alert({
          title: 'Enviado',
          content:
            'El ticket de la venta ha sido correctamente enviado a la dirección "' + email + '"',
        });
      } else {
        this.dialog.alert({
          title: 'Error',
          content:
            'El ticket de la venta no ha podido ser enviado a la dirección "' +
            email +
            '", ¿tal vez la dirección no es correcta?',
        });
      }
    });
  }

  devolucion(): void {
    const venta: VentaHistorico | null = this.historicoVentasSelected();
    if (venta === null || venta.id === null) {
      return;
    }

    this.cerrarVentanaEvent.emit(0);
    this.router.navigate(['/ventas/' + venta.id]);
  }

  private clearSelectedVenta(): void {
    this.historicoVentasSelected.set(null);
    this.historicoVentasSelectedDataSource.data = [];
  }

  private refreshSelectedVenta(): void {
    const venta: VentaHistorico | null = this.historicoVentasSelected();
    if (venta !== null) {
      this.historicoVentasSelected.set(venta);
      this.historicoVentasDataSource.data = [...this.historicoVentasList()];
    }
  }
}
