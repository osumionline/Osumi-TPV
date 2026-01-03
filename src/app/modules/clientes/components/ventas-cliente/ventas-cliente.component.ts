import { Component, effect, inject, input, InputSignal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import FixedNumberPipe from '@app/modules/shared/pipes/fixed-number.pipe';
import { VentasClienteResult } from '@interfaces/cliente.interface';
import { Month, StatusResult } from '@interfaces/interfaces';
import VentaHistorico from '@model/caja/venta-historico.model';
import VentaLineaHistorico from '@model/caja/venta-linea-historico.model';
import Cliente from '@model/clientes/cliente.model';
import { DialogService } from '@osumi/angular-tools';
import { urlencode } from '@osumi/tools';
import ClassMapperService from '@services/class-mapper.service';
import ClientesService from '@services/clientes.service';
import ConfigService from '@services/config.service';
import VentasService from '@services/ventas.service';

@Component({
  selector: 'otpv-ventas-cliente',
  imports: [
    MatFormField,
    MatSelect,
    FormsModule,
    MatOption,
    MatTableModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    FixedNumberPipe,
  ],
  templateUrl: './ventas-cliente.component.html',
  styleUrl: './ventas-cliente.component.scss',
})
export default class VentasClienteComponent implements OnInit {
  private readonly cs: ClientesService = inject(ClientesService);
  private readonly vs: VentasService = inject(VentasService);
  private readonly config: ConfigService = inject(ConfigService);
  private readonly dialog: DialogService = inject(DialogService);
  private readonly cms: ClassMapperService = inject(ClassMapperService);

  selectedClient: InputSignal<Cliente> = input.required<Cliente>();
  monthList: Month[] = [];
  yearList: number[] = [];

  ventasMonth: number | null = null;
  ventasYear: number | null = null;
  ventasDisplayedColumns: string[] = ['fecha', 'total', 'nombreTipoPago', 'options'];
  ventasDataSource: MatTableDataSource<VentaHistorico> = new MatTableDataSource<VentaHistorico>();
  ventaSelected: VentaHistorico | null = null;
  ventaSelectedDisplayedColumns: string[] = [
    'localizador',
    'marca',
    'articulo',
    'unidades',
    'pvp',
    'descuento',
    'importe',
  ];
  ventaSelectedDataSource: MatTableDataSource<VentaLineaHistorico> =
    new MatTableDataSource<VentaLineaHistorico>();

  constructor() {
    effect((): void => {
      const currentCliente: Cliente = this.selectedClient(); // accedemos al valor del signal
      if (currentCliente !== null) {
        this.searchVentasCliente();
      }
    });
  }

  ngOnInit(): void {
    this.monthList = this.config.monthList;
    const currentYear: number = new Date().getFullYear();
    this.yearList = Array.from({ length: 5 }, (_, i) => currentYear - i);
  }

  searchVentasCliente(): void {
    this.ventaSelected = null;
    this.ventaSelectedDataSource.data = [];
    if (
      (this.ventasMonth === null && this.ventasYear === null) ||
      (this.ventasMonth !== null && this.ventasYear !== null)
    ) {
      this.cs
        .searchVentasCliente(this.selectedClient().id as number, this.ventasMonth, this.ventasYear)
        .subscribe((result: VentasClienteResult): void => {
          if (result.status === 'ok') {
            const ventasCliente: VentaHistorico[] = this.cms.getHistoricoVentas(result.list);
            this.ventasDataSource.data = ventasCliente;
          }
        });
    }
  }

  selectVenta(ind: number): void {
    this.ventaSelected = this.ventasDataSource.data[ind];
    this.ventaSelectedDataSource.data = this.ventaSelected.lineas;
  }

  printTicket(ev: MouseEvent, venta: VentaHistorico): void {
    ev.stopPropagation();
    console.log('imprimirTicket', venta);
    this.vs
      .printTicket(this.ventaSelected!.id as number, 'venta')
      .subscribe((result: StatusResult): void => {
        if (result.status === 'error') {
          this.dialog.alert({
            title: 'Error',
            content: 'Ocurrió un error al imprimir el ticket.',
          });
        }
      });
  }

  enviarEmail(ev: MouseEvent, venta: VentaHistorico): void {
    ev.stopPropagation();
    console.log('emailTicket', venta);
    this.dialog
      .confirm({
        title: 'Enviar email',
        content: `Se enviará el ticket al email "${
          this.selectedClient().email
        }", ¿quieres continuar?`,
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.sendTicketConfirm(
            this.ventaSelected!.id as number,
            this.selectedClient().email as string
          );
        }
      });
  }

  sendTicketConfirm(id: number, email: string): void {
    this.vs.sendTicket(id, urlencode(email) as string).subscribe((result: StatusResult): void => {
      if (result.status === 'ok') {
        this.dialog.alert({
          title: 'Enviado',
          content: `El ticket de la venta ha sido correctamente enviado a la dirección "${email}"`,
        });
      } else {
        this.dialog.alert({
          title: 'Error',
          content: `El ticket de la venta no ha podido ser enviado a la dirección "${email}", ¿tal vez la dirección no es correcta?`,
        });
      }
    });
  }
}
