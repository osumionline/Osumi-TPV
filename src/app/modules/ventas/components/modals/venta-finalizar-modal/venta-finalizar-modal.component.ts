import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { formatNumber, toNumber } from "@osumi/tools";
import { FinVentaResult } from "src/app/interfaces/venta.interface";
import { CustomOverlayRef } from "src/app/model/tpv/custom-overlay-ref.model";
import { VentaLinea } from "src/app/model/ventas/venta-linea.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { FixedNumberPipe } from "src/app/modules/shared/pipes/fixed-number.pipe";
import { ConfigService } from "src/app/services/config.service";
import { DialogService } from "src/app/services/dialog.service";
import { VentasService } from "src/app/services/ventas.service";

@Component({
  standalone: true,
  selector: "otpv-venta-finalizar-modal",
  templateUrl: "./venta-finalizar-modal.component.html",
  styleUrls: ["./venta-finalizar-modal.component.scss"],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    MatSortModule,
    FixedNumberPipe,
  ],
})
export class VentaFinalizarModalComponent implements OnInit, AfterViewInit {
  @ViewChild("efectivoValue", { static: true }) efectivoValue: ElementRef;
  @ViewChild("tarjetaValue", { static: true }) tarjetaValue: ElementRef;

  ventasFinDisplayedColumns: string[] = [
    "localizador",
    "descripcion",
    "cantidad",
    "descuento",
    "total",
  ];
  ventasFinDataSource: MatTableDataSource<VentaLinea> =
    new MatTableDataSource<VentaLinea>();
  @ViewChild(MatSort) sort: MatSort;

  saving: boolean = false;

  constructor(
    public vs: VentasService,
    public config: ConfigService,
    private dialog: DialogService,
    private router: Router,
    private customOverlayRef: CustomOverlayRef<null, {}>
  ) {}

  ngOnInit(): void {
    this.ventasFinDataSource.data = this.vs.fin.lineas;
    setTimeout((): void => {
      this.efectivoValue.nativeElement.select();
    }, 0);
  }

  ngAfterViewInit(): void {
    this.ventasFinDataSource.sort = this.sort;
  }

  @HostListener("window:keydown", ["$event"])
  onKeyDown(ev: KeyboardEvent): void {
    if (ev.key === "Enter") {
      this.finalizarVenta();
    }
  }

  updateCambio(): void {
    let cambio: string = "";
    if (!this.vs.fin.pagoMixto) {
      cambio = formatNumber(
        toNumber(this.vs.fin.efectivo) - toNumber(this.vs.fin.total)
      );
    } else {
      cambio = formatNumber(
        toNumber(this.vs.fin.efectivo) +
          toNumber(this.vs.fin.tarjeta) -
          toNumber(this.vs.fin.total)
      );
    }
    if (toNumber(cambio) > 0) {
      this.vs.fin.cambio = cambio;
    }
  }

  selectTipoPago(id: number): void {
    if (this.vs.fin.idTipoPago === id) {
      this.vs.fin.idTipoPago = null;
      this.vs.fin.efectivo = this.vs.fin.total;
      setTimeout((): void => {
        this.efectivoValue.nativeElement.select();
      }, 0);
    } else {
      this.vs.fin.idTipoPago = id;
      if (this.vs.fin.pagoMixto) {
        this.updateEfectivoMixto();
        setTimeout((): void => {
          this.tarjetaValue.nativeElement.select();
        }, 0);
      } else {
        this.vs.fin.efectivo = "0";
        this.vs.fin.cambio = "0";
      }
    }
  }

  updateEfectivoMixto(): void {
    if (toNumber(this.vs.fin.tarjeta) === 0) {
      this.vs.fin.efectivo = "0";
      this.vs.fin.cambio = "0";
      return;
    }
    const efectivo: string = formatNumber(
      toNumber(this.vs.fin.total) - toNumber(this.vs.fin.tarjeta)
    );
    if (toNumber(efectivo) > 0) {
      this.vs.fin.efectivo = efectivo;
      this.vs.fin.cambio = "0";
    } else {
      this.vs.fin.efectivo = "0";
      this.vs.fin.cambio = formatNumber(toNumber(efectivo) * -1);
    }
  }

  changePagoMixto(ev: MatCheckboxChange): void {
    if (ev.checked) {
      setTimeout(() => {
        this.tarjetaValue.nativeElement.select();
      }, 0);
    } else {
      if (this.vs.fin.idTipoPago === null) {
        this.vs.fin.efectivo = "0";
        this.vs.fin.tarjeta = "0";
        setTimeout(() => {
          this.efectivoValue.nativeElement.select();
        }, 0);
      } else {
        this.vs.fin.tarjeta = "0";
      }
    }
  }

  checkTicket(): void {
    // Se ha elegido email y no tiene cliente asignado
    if (this.vs.fin.imprimir === "email" && this.vs.fin.idCliente === -1) {
      this.dialog
        .confirm({
          title: "Enviar email",
          content:
            "Esta venta no tiene ningún cliente asignado, ¿quieres elegir uno o introducir uno manualmente?",
          ok: "Elegir cliente",
          cancel: "Introducir email",
        })
        .subscribe((result) => {
          if (result === true) {
            this.customOverlayRef.close({ status: "cliente" });
          } else {
            this.pedirEmail();
          }
        });
    }
    // Se ha elegido email, tiene cliente asignado pero no tiene email
    if (
      this.vs.fin.imprimir === "email" &&
      this.vs.fin.idCliente !== -1 &&
      (this.vs.cliente.email === null || this.vs.cliente.email === "")
    ) {
      this.dialog
        .confirm({
          title: "Enviar email",
          content:
            "El cliente seleccionado no tiene una dirección de email asignada, ¿quieres ir a su ficha o introducir uno manualmente?",
          ok: "Ir a su ficha",
          cancel: "Introducir email",
        })
        .subscribe((result) => {
          if (result === true) {
            this.router.navigate(["/clientes/" + this.vs.cliente.id]);
          } else {
            this.pedirEmail();
          }
        });
    }
    // Se ha elegido factura y no tiene cliente asignado
    if (this.vs.fin.imprimir === "factura" && this.vs.fin.idCliente === -1) {
      this.dialog
        .confirm({
          title: "Imprimir factura",
          content:
            "Esta venta no tiene ningún cliente asignado, ¿quieres elegir uno?",
          ok: "Continuar",
          cancel: "Cancelar",
        })
        .subscribe((result) => {
          if (result === true) {
            this.customOverlayRef.close({ status: "factura" });
          } else {
            this.vs.fin.imprimir = "si";
          }
        });
    }
    // Se ha elegido reserva y no tiene cliente asignado
    if (this.vs.fin.imprimir === "reserva" && this.vs.fin.idCliente === -1) {
      this.dialog
        .confirm({
          title: "Reserva",
          content:
            "Esta reserva no tiene ningún cliente asignado, ¿quieres elegir uno?",
          ok: "Continuar",
          cancel: "Cancelar",
        })
        .subscribe((result) => {
          if (result === true) {
            this.customOverlayRef.close({ status: "reserva" });
          } else {
            this.vs.fin.imprimir = "si";
          }
        });
    }
  }

  pedirEmail(): void {
    this.dialog
      .form({
        title: "Introducir email",
        content: "Introduce el email del cliente",
        ok: "Continuar",
        cancel: "Cancelar",
        fields: [{ title: "Email", type: "email", value: null }],
      })
      .subscribe((result) => {
        if (result === undefined) {
          this.vs.fin.imprimir = "si";
        } else {
          this.vs.fin.email = result[0].value;
        }
      });
  }

  cerrarFinalizarVenta(): void {
    this.customOverlayRef.close({ status: "cancelar" });
  }

  finalizarVenta(): void {
    const tarjeta: number = toNumber(this.vs.fin.tarjeta);
    const efectivo: number = toNumber(this.vs.fin.efectivo);
    const total: number = toNumber(this.vs.fin.total);

    if (this.vs.fin.imprimir === "reserva") {
      this.vs.guardarReserva().subscribe((result: FinVentaResult): void => {
        this.customOverlayRef.close({
          status: "fin-reserva",
        });
      });
      return;
    }

    if (this.vs.fin.pagoMixto) {
      if (this.vs.fin.idTipoPago === null) {
        this.dialog.alert({
          title: "Error",
          content:
            "¡Has indicado pago mixto pero no has elegido ningún tipo de pago!",
          ok: "Continuar",
        });
        return;
      } else {
        if (tarjeta + efectivo < total) {
          this.dialog
            .alert({
              title: "Error",
              content:
                "¡Las cantidades introducidas (tarjeta y efectivo) son inferiores al importe total!",
              ok: "Continuar",
            })
            .subscribe((result) => {
              setTimeout(() => {
                this.tarjetaValue.nativeElement.select();
              }, 0);
            });
          return;
        }
      }
    } else {
      if (this.vs.fin.idTipoPago === null && efectivo < total) {
        this.dialog
          .alert({
            title: "Error",
            content: "¡La cantidad introducida es inferior al importe total!",
            ok: "Continuar",
          })
          .subscribe((result) => {
            setTimeout(() => {
              this.efectivoValue.nativeElement.select();
            }, 0);
          });
        return;
      }
    }

    this.saving = true;
    this.vs.guardarVenta().subscribe((result) => {
      this.customOverlayRef.close({
        status: "fin",
        importe: result.importe,
        cambio: result.cambio,
      });
    });
  }
}
