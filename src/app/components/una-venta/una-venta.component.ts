import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { Empleado } from "src/app/model/empleado.model";
import { LineaVenta } from "src/app/model/linea-venta.model";
import { ArticulosService } from "src/app/services/articulos.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { DialogService } from "src/app/services/dialog.service";
import { EmpleadosService } from "src/app/services/empleados.service";
import { MarcasService } from "src/app/services/marcas.service";
import { VentasService } from "src/app/services/ventas.service";
import { rolList } from "src/app/shared/rol.class";

@Component({
  selector: "otpv-una-venta",
  templateUrl: "./una-venta.component.html",
  styleUrls: ["./una-venta.component.scss"],
})
export class UnaVentaComponent {
  @Input() ind: number = null;
  @Output() deleteVentaLineaEvent: EventEmitter<number> =
    new EventEmitter<number>();
  @Output() endVentaEvent: EventEmitter<number> = new EventEmitter<number>();
  searching: boolean = false;
  editarCantidad: boolean = false;
  editarImporte: boolean = false;
  editarDescuento: boolean = false;
  muestraDescuento: boolean = false;
  descuentoSelected: number = null;
  descuentoImporte: number = null;
  @ViewChild("descuentoValue", { static: true }) descuentoValue: ElementRef;

  showClienteEstadisticas: boolean = true;

  constructor(
    private cms: ClassMapperService,
    private dialog: DialogService,
    private ms: MarcasService,
    public vs: VentasService,
    private ars: ArticulosService,
    public es: EmpleadosService
  ) {}

  loginSuccess(ev: Empleado): void {
    console.log("loginSuccess");
    this.vs.ventaActual.setEmpleado(ev);
    this.vs.addLineaVenta();
    this.vs.ventaActual.mostrarEmpleados = false;
    this.setFocus();
  }

  setFocus(): void {
    console.log("setFocus");
    console.log(this.vs);
    if (!this.vs.ventaActual.mostrarEmpleados) {
      setTimeout(() => {
        const loc: HTMLInputElement = document.getElementById(
          "loc-new-" + this.ind
        ) as HTMLInputElement;
        loc.focus();
      }, 0);
    }
  }

  checkLocalizador(ev: KeyboardEvent, ind: number): void {
    if (ev.key === "Enter") {
      this.searching = true;
      this.ars
        .loadArticulo(this.vs.ventaActual.lineas[ind].localizador)
        .subscribe((result) => {
          this.searching = false;
          if (result.status === "ok") {
            const articulo = this.cms.getArticulo(result.articulo);
            const marca = this.ms.findById(articulo.idMarca);
            articulo.marca = marca.nombre;
            const indArticulo: number = this.vs.ventaActual.lineas.findIndex(
              (x: LineaVenta): boolean => x.idArticulo === articulo.id
            );

            if (indArticulo === -1) {
              this.vs.ventaActual.lineas[ind] = new LineaVenta().fromArticulo(
                articulo
              );
              this.vs.addLineaVenta();
            } else {
              this.vs.ventaActual.lineas[indArticulo].cantidad++;
              this.vs.ventaActual.lineas[ind].localizador = null;
            }
            this.setFocus();

            this.vs.ventaActual.updateImporte();
            if (articulo.mostrarObsVentas && articulo.observaciones) {
              this.dialog
                .alert({
                  title: "Observaciones",
                  content: articulo.observaciones,
                  ok: "Continuar",
                })
                .subscribe((result) => {
                  this.setFocus();
                });
            }
          } else {
            this.dialog
              .alert({
                title: "Error",
                content: "¡El código introducido no se encuentra!",
                ok: "Continuar",
              })
              .subscribe((result) => {
                this.vs.ventaActual.lineas[ind].localizador = null;
                this.setFocus();
              });
          }
        });
    }
  }

  borraLinea(ind: number): void {
    this.dialog
      .confirm({
        title: "¡Atención!",
        content: "¿Está seguro de querer borrar esta línea?",
        ok: "Confirmar",
        cancel: "Cancelar",
      })
      .subscribe((result) => {
        if (result === true) {
          this.deleteVentaLineaEvent.emit(ind);
        }
      });
  }

  showObservaciones(ev: MouseEvent, observaciones: string): void {
    ev.stopPropagation();
    this.dialog
      .alert({
        title: "Observaciones",
        content: observaciones,
        ok: "Continuar",
      })
      .subscribe((result) => {
        this.setFocus();
      });
  }

  updateCantidad(ind: number): void {
    if (!this.vs.ventaActual.lineas[ind].cantidad) {
      this.vs.ventaActual.lineas[ind].cantidad = 1;
    }
    this.vs.ventaActual.updateImporte();
  }

  editarLineaCantidad(i: number): void {
    this.editarCantidad = true;
    setTimeout(() => {
      const cantidad: HTMLInputElement = document.getElementById(
        "linea-cantidad-" + this.ind + "_" + i
      ) as HTMLInputElement;
      cantidad.select();
    }, 0);
  }

  checkCantidad(ev: KeyboardEvent, ind: number, close: boolean): void {
    if (ev.key == "Enter" || close) {
      this.editarCantidad = false;
      this.vs.ventaActual.updateImporte();
      this.setFocus();
    }
  }

  editarLineaImporte(i: number): void {
    if (
      !this.vs.ventaActual.empleado.hasRol(
        rolList.ventas.roles["modificarImportes"].id
      )
    ) {
      return;
    }
    if (this.vs.ventaActual.lineas[i].descuentoManual) {
      this.dialog
        .alert({
          title: "Atención",
          content:
            "Se ha introducido un descuento a mano para el artículo, de modo que no se puede introducir un importe",
          ok: "Continuar",
        })
        .subscribe((result) => {
          this.setFocus();
        });
      return;
    }
    this.editarImporte = true;
    setTimeout(() => {
      const importe: HTMLInputElement = document.getElementById(
        "linea-importe-" + this.ind + "_" + i
      ) as HTMLInputElement;
      importe.select();
    }, 0);
  }

  checkImporte(ev: KeyboardEvent, ind: number, close: boolean): void {
    if (ev.key == "Enter" || close) {
      this.editarImporte = false;
      this.vs.ventaActual.lineas[ind].importeManual = true;
      this.vs.ventaActual.updateImporte();
      this.setFocus();
    }
  }

  quitaImporteManual(ev: MouseEvent, ind: number): void {
    ev.stopPropagation();
    this.vs.ventaActual.lineas[ind].importeManual = false;
    this.setFocus();
  }

  editarLineaDescuento(i: number): void {
    if (this.vs.ventaActual.lineas[i].importeManual) {
      this.dialog
        .alert({
          title: "Atención",
          content:
            "Se ha introducido un importe a mano para el artículo, de modo que no se puede introducir un descuento",
          ok: "Continuar",
        })
        .subscribe((result) => {
          this.setFocus();
        });
      return;
    }
    if (this.vs.ventaActual.lineas[i].descuentoManual) {
      this.dialog
        .alert({
          title: "Atención",
          content:
            "Se ha introducido un descuento a mano para el artículo, de modo que no se puede introducir un importe",
          ok: "Continuar",
        })
        .subscribe((result) => {
          this.setFocus();
        });
      return;
    }
    this.editarDescuento = true;
    setTimeout(() => {
      const descuento: HTMLInputElement = document.getElementById(
        "linea-descuento-" + this.ind + "_" + i
      ) as HTMLInputElement;
      descuento.select();
    }, 0);
  }

  checkDescuento(ev: KeyboardEvent, close: boolean): void {
    if (ev.key == "Enter" || close) {
      this.editarDescuento = false;
      this.vs.ventaActual.updateImporte();
      this.setFocus();
    }
  }

  quitaDescuentoManual(ev: MouseEvent, ind: number): void {
    ev.stopPropagation();
    this.vs.ventaActual.lineas[ind].descuento = 0;
    this.vs.ventaActual.lineas[ind].descuentoManual = false;
    this.setFocus();
  }

  abreDescuento(ev: MouseEvent, linea: LineaVenta): void {
    ev.stopPropagation();
    this.descuentoSelected = linea.idArticulo;
    this.descuentoImporte = null;
    this.muestraDescuento = true;
    setTimeout(() => {
      this.descuentoValue.nativeElement.focus();
    }, 0);
  }

  cerrarDescuento(ev: MouseEvent = null): void {
    ev && ev.preventDefault();
    this.muestraDescuento = false;
  }

  checkDescuentoImporte(ev: KeyboardEvent): void {
    if (ev.key == "Enter") {
      this.selectDescuento();
    }
  }

  selectDescuento(): void {
    if (!this.descuentoImporte) {
      this.dialog
        .alert({
          title: "Error",
          content: "¡No has introducido ningún descuento!",
          ok: "Continuar",
        })
        .subscribe((result) => {
          setTimeout(() => {
            this.descuentoValue.nativeElement.focus();
          }, 0);
        });
      return;
    }
    const ind = this.vs.ventaActual.lineas.findIndex(
      (x) => x.idArticulo === this.descuentoSelected
    );
    this.vs.ventaActual.lineas[ind].descuento = this.descuentoImporte;
    this.vs.ventaActual.lineas[ind].descuentoManual = true;
    this.vs.ventaActual.updateImporte();
    this.cerrarDescuento();
  }

  closeClienteEstadisticas(): void {
    this.showClienteEstadisticas = !this.showClienteEstadisticas;
  }

  cancelarVenta(): void {
    this.dialog
      .confirm({
        title: "Confirmar",
        content: "¿Estás seguro de querer cancelar esta venta?",
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result) => {
        if (result === true) {
          this.vs.ventaActual.lineas = [];
          this.vs.ventaActual.updateImporte();
          this.vs.addLineaVenta();
        }
      });
  }

  terminarVenta(): void {
    this.endVentaEvent.emit(this.vs.ventaActual.id);
  }
}
