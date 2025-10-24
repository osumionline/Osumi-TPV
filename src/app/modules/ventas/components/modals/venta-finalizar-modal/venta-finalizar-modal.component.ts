import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  Signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import VentaFin from '@app/model/ventas/venta-fin.model';
import { FinVentaResult } from '@interfaces/venta.interface';
import VentaLinea from '@model/ventas/venta-linea.model';
import {
  CustomOverlayRef,
  DialogField,
  DialogService,
} from '@osumi/angular-tools';
import { formatNumber, toNumber } from '@osumi/tools';
import ConfigService from '@services/config.service';
import VentasService from '@services/ventas.service';
import FixedNumberPipe from '@shared/pipes/fixed-number.pipe';

@Component({
  selector: 'otpv-venta-finalizar-modal',
  templateUrl: './venta-finalizar-modal.component.html',
  styleUrls: ['./venta-finalizar-modal.component.scss'],
  imports: [
    FormsModule,
    MatSortModule,
    FixedNumberPipe,
    MatFormFieldModule,
    MatLabel,
    MatInput,
    MatCheckbox,
    MatTableModule,
    MatSelect,
    MatOption,
    MatButton,
  ],
  host: {
    'window:keydown': 'onKeyDown($event)',
  },
})
export default class VentaFinalizarModalComponent
  implements OnInit, AfterViewInit
{
  public vs: VentasService = inject(VentasService);
  public config: ConfigService = inject(ConfigService);
  private dialog: DialogService = inject(DialogService);
  private router: Router = inject(Router);
  private customOverlayRef: CustomOverlayRef<null, { fin: VentaFin }> =
    inject(CustomOverlayRef);

  efectivoValue: Signal<ElementRef> =
    viewChild.required<ElementRef>('efectivoValue');
  tarjetaValue: Signal<ElementRef> =
    viewChild.required<ElementRef>('tarjetaValue');

  ventasFinDisplayedColumns: string[] = [
    'localizador',
    'descripcion',
    'cantidad',
    'descuento',
    'total',
  ];
  ventasFinDataSource: MatTableDataSource<VentaLinea> =
    new MatTableDataSource<VentaLinea>();
  sort: Signal<MatSort> = viewChild(MatSort);

  ventaFin: VentaFin = this.customOverlayRef.data.fin;
  saving: boolean = false;

  ngOnInit(): void {
    this.ventasFinDataSource.data = this.ventaFin.lineas;
    setTimeout((): void => {
      this.efectivoValue().nativeElement.select();
    }, 0);
  }

  ngAfterViewInit(): void {
    this.ventasFinDataSource.sort = this.sort();
  }

  onKeyDown(ev: KeyboardEvent): void {
    if (ev.key === 'Enter') {
      this.finalizarVenta();
    }
  }

  updateCambio(): void {
    let cambio: string = '';
    if (!this.ventaFin.pagoMixto) {
      cambio = formatNumber(
        toNumber(this.ventaFin.efectivo) - toNumber(this.ventaFin.total)
      );
    } else {
      cambio = formatNumber(
        toNumber(this.ventaFin.efectivo) +
          toNumber(this.ventaFin.tarjeta) -
          toNumber(this.ventaFin.total)
      );
    }
    if (toNumber(cambio) > 0) {
      this.ventaFin.cambio = cambio;
    }
  }

  selectTipoPago(id: number): void {
    if (this.ventaFin.idTipoPago === id) {
      this.ventaFin.idTipoPago = null;
      this.ventaFin.efectivo = this.ventaFin.total;
      setTimeout((): void => {
        this.efectivoValue().nativeElement.select();
      }, 0);
    } else {
      this.ventaFin.idTipoPago = id;
      if (this.ventaFin.pagoMixto) {
        this.updateEfectivoMixto();
        setTimeout((): void => {
          this.tarjetaValue().nativeElement.select();
        }, 0);
      } else {
        this.ventaFin.efectivo = '0';
        this.ventaFin.cambio = '0';
      }
    }
  }

  updateEfectivoMixto(): void {
    if (toNumber(this.ventaFin.tarjeta) === 0) {
      this.ventaFin.efectivo = '0';
      this.ventaFin.cambio = '0';
      return;
    }
    const efectivo: string = formatNumber(
      toNumber(this.ventaFin.total) - toNumber(this.ventaFin.tarjeta)
    );
    if (toNumber(efectivo) > 0) {
      this.ventaFin.efectivo = efectivo;
      this.ventaFin.cambio = '0';
    } else {
      this.ventaFin.efectivo = '0';
      this.ventaFin.cambio = formatNumber(toNumber(efectivo) * -1);
    }
  }

  changePagoMixto(ev: MatCheckboxChange): void {
    if (ev.checked) {
      setTimeout((): void => {
        this.tarjetaValue().nativeElement.select();
      }, 0);
    } else {
      if (this.ventaFin.idTipoPago === null) {
        this.ventaFin.efectivo = '0';
        this.ventaFin.tarjeta = '0';
        setTimeout((): void => {
          this.efectivoValue().nativeElement.select();
        }, 0);
      } else {
        this.ventaFin.tarjeta = '0';
      }
    }
  }

  checkTicket(): void {
    // Se ha elegido email y no tiene cliente asignado
    if (this.ventaFin.imprimir === 'email' && this.ventaFin.idCliente === -1) {
      this.dialog
        .confirm({
          title: 'Enviar email',
          content:
            'Esta venta no tiene ningún cliente asignado, ¿quieres elegir uno o introducir uno manualmente?',
          ok: 'Elegir cliente',
          cancel: 'Introducir email',
        })
        .subscribe((result: boolean): void => {
          if (result === true) {
            this.customOverlayRef.close({ status: 'cliente' });
          } else {
            this.pedirEmail();
          }
        });
    }
    // Se ha elegido email, tiene cliente asignado pero no tiene email
    if (
      this.ventaFin.imprimir === 'email' &&
      this.ventaFin.idCliente !== -1 &&
      (this.vs.cliente.email === null || this.vs.cliente.email === '')
    ) {
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
            this.router.navigate(['/clientes/' + this.vs.cliente.id]);
          } else {
            this.pedirEmail();
          }
        });
    }
    // Se ha elegido factura y no tiene cliente asignado
    if (
      this.ventaFin.imprimir === 'factura' &&
      this.ventaFin.idCliente === -1
    ) {
      this.dialog
        .confirm({
          title: 'Imprimir factura',
          content:
            'Esta venta no tiene ningún cliente asignado, ¿quieres elegir uno?',
        })
        .subscribe((result: boolean): void => {
          if (result === true) {
            this.customOverlayRef.close({ status: 'factura' });
          } else {
            this.ventaFin.imprimir = 'si';
          }
        });
    }
    // Se ha elegido reserva y no tiene cliente asignado
    if (
      (this.ventaFin.imprimir === 'reserva' ||
        this.ventaFin.imprimir === 'reserva-sin-ticket') &&
      this.ventaFin.idCliente === -1
    ) {
      this.dialog
        .confirm({
          title: 'Reserva',
          content:
            'Esta reserva no tiene ningún cliente asignado, ¿quieres elegir uno?',
        })
        .subscribe((result: boolean): void => {
          if (result === true) {
            this.customOverlayRef.close({ status: 'reserva' });
          } else {
            this.ventaFin.imprimir = 'si';
          }
        });
    }
  }

  pedirEmail(): void {
    this.dialog
      .form({
        title: 'Introducir email',
        content: 'Introduce el email del cliente',
        fields: [
          { title: 'Email', type: 'email', value: null, required: true },
        ],
      })
      .subscribe((result: DialogField[]): void => {
        if (result === undefined || result.length === 0) {
          this.ventaFin.imprimir = 'si';
        } else {
          this.ventaFin.email = result[0].value;
        }
      });
  }

  cerrarFinalizarVenta(): void {
    this.customOverlayRef.close({ status: 'cancelar' });
  }

  finalizarVenta(): void {
    const tarjeta: number = toNumber(this.ventaFin.tarjeta);
    const efectivo: number = toNumber(this.ventaFin.efectivo);
    const total: number = toNumber(this.ventaFin.total);

    if (
      this.ventaFin.imprimir === 'reserva' ||
      this.ventaFin.imprimir === 'reserva-sin-ticket'
    ) {
      this.vs.guardarReserva().subscribe((result: FinVentaResult): void => {
        if (result.status === 'ok') {
          this.customOverlayRef.close({
            status: 'fin-reserva',
          });
        } else {
          this.dialog.alert({
            title: 'Error',
            content: 'Ocurrió un error al guardar la reserva.',
          });
        }
      });
      return;
    }

    if (this.ventaFin.pagoMixto) {
      if (this.ventaFin.idTipoPago === null) {
        this.dialog.alert({
          title: 'Error',
          content:
            '¡Has indicado pago mixto pero no has elegido ningún tipo de pago!',
        });
        return;
      } else {
        if (tarjeta + efectivo < total) {
          this.dialog
            .alert({
              title: 'Error',
              content:
                '¡Las cantidades introducidas (tarjeta y efectivo) son inferiores al importe total!',
            })
            .subscribe((): void => {
              setTimeout((): void => {
                this.tarjetaValue().nativeElement.select();
              }, 0);
            });
          return;
        }
      }
    } else {
      if (this.ventaFin.idTipoPago === null && efectivo < total) {
        this.dialog
          .alert({
            title: 'Error',
            content: '¡La cantidad introducida es inferior al importe total!',
          })
          .subscribe((): void => {
            setTimeout((): void => {
              this.efectivoValue().nativeElement.select();
            }, 0);
          });
        return;
      }
    }

    this.saving = true;
    this.vs.guardarVenta().subscribe((result: FinVentaResult): void => {
      if (result.status === 'ok-tbai-error') {
        this.dialog.alert({
          title: 'Atención',
          content:
            'La venta se ha guardado correctamente pero se ha producido un error al enviar a TicketBai.',
        });
      }
      if (result.status === 'ok-email-error') {
        this.dialog.alert({
          title: 'Atención',
          content:
            'La venta se ha guardado correctamente pero se ha producido un error al enviar el email.',
        });
      }
      if (result.status.startsWith('ok-factura-')) {
        const parts: string[] = result.status.split('-');
        const id: number = parseInt(parts.pop());
        window.open('/clientes/factura/' + id);
      }
      this.customOverlayRef.close({
        status: 'fin',
        importe: result.importe,
        cambio: result.cambio,
      });
    });
  }
}
