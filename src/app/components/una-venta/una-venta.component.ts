import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { AccesoDirecto } from "src/app/model/acceso-directo.model";
import { ArticuloBuscador } from "src/app/model/articulo-buscador.model";
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
export class UnaVentaComponent implements AfterViewInit {
  @Input() ind: number = null;
  @Output() deleteVentaLineaEvent: EventEmitter<number> =
    new EventEmitter<number>();
  @Output() endVentaEvent: EventEmitter<number> = new EventEmitter<number>();
  searching: boolean = false;
  observacionesOpen: boolean = false;
  editarCantidad: boolean = false;
  editarImporte: boolean = false;
  editarDescuento: boolean = false;
  muestraDescuento: boolean = false;
  descuentoSelected: number = null;
  descuentoImporte: number = null;
  @ViewChild("descuentoValue", { static: true }) descuentoValue: ElementRef;

  showClienteEstadisticas: boolean = true;
  showUltimaVenta: boolean = false;
  ultimaVentaImporte: number = null;
  ultimaVentaCambio: number = null;

  muestraBuscador: boolean = false;
  @ViewChild("searchBoxName", { static: true }) searchBoxName: ElementRef;
  searchName: string = "";
  buscadorResultadosList: ArticuloBuscador[] = [];
  buscadorResultadosRow: number = 0;
  buscadorResultadosDisplayedColumns: string[] = [
    "nombre",
    "marca",
    "pvp",
    "stock",
  ];
  buscadorResultadosDataSource: MatTableDataSource<ArticuloBuscador> =
    new MatTableDataSource<ArticuloBuscador>();
  @ViewChild(MatSort) sort: MatSort;

  muestraAccesosDirectos: boolean = false;
  accesosDirectosList: AccesoDirecto[] = [];
  accesosDirectosDisplayedColumns: string[] = ["accesoDirecto", "nombre"];
  accesosDirectosDataSource: MatTableDataSource<AccesoDirecto> =
    new MatTableDataSource<AccesoDirecto>();

  constructor(
    private cms: ClassMapperService,
    private dialog: DialogService,
    private ms: MarcasService,
    public vs: VentasService,
    private ars: ArticulosService,
    public es: EmpleadosService
  ) {}

  ngAfterViewInit() {
    this.buscadorResultadosDataSource.sort = this.sort;
    this.accesosDirectosDataSource.sort = this.sort;
  }

  @HostListener("window:keydown", ["$event"])
  onKeyDown(ev: KeyboardEvent): void {
    if (ev.key === "Escape") {
      if (this.muestraBuscador) {
        this.cerrarBuscador();
      }
      if (this.muestraAccesosDirectos) {
        this.cerrarAccesosDirectos();
      }
    }
  }

  loginSuccess(ev: Empleado): void {
    this.vs.ventaActual.setEmpleado(ev);
    this.vs.addLineaVenta();
    this.vs.ventaActual.mostrarEmpleados = false;
    this.setFocus();
  }

  setFocus(value: number = null): void {
    if (!this.vs.ventaActual.mostrarEmpleados) {
      setTimeout(() => {
        const loc: HTMLInputElement = document.getElementById(
          "loc-new-" + this.ind
        ) as HTMLInputElement;
        // Si viene valor lo introduzco
        if (value !== null) {
          loc.value = value.toString();
          this.vs.ventaActual.lineas[
            this.vs.ventaActual.lineas.length - 1
          ].localizador = value;
        }
        // Pongo el foco
        loc.focus();
        // Si viene valor pulso intro
        if (value !== null) {
          const ev: KeyboardEvent = new KeyboardEvent("keydown", {
            code: "Enter",
            key: "Enter",
            keyCode: 13,
            which: 13,
          });
          loc.dispatchEvent(ev);
        }
      }, 0);
    }
  }

  checkLocalizador(ev: KeyboardEvent, ind: number): void {
    const letters = /^[a-zA-Z]{1}$/;
    if (ev.key.match(letters)) {
      ev.preventDefault();
      this.abreBuscador(ev.key);
      return;
    }
    if (ev.key === "Enter" && !this.observacionesOpen) {
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
    this.observacionesOpen = true;
    this.dialog
      .alert({
        title: "Observaciones",
        content: observaciones,
        ok: "Continuar",
      })
      .subscribe((result) => {
        this.observacionesOpen = false;
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

  abreBuscador(key: string): void {
    this.muestraBuscador = true;
    this.searchName = key;
    this.buscadorResultadosRow = 0;
    setTimeout(() => {
      this.searchBoxName.nativeElement.focus();
    }, 0);
    this.searchStart();
  }

  cerrarBuscador(ev: MouseEvent = null): void {
    ev && ev.preventDefault();
    this.muestraBuscador = false;
    this.setFocus();
  }

  checkSearchKeys(ev: KeyboardEvent = null): void {
    if (
      ev !== null &&
      (ev.key === "ArrowDown" || ev.key === "ArrowUp" || ev.key === "Enter")
    ) {
      ev.preventDefault();
      if (ev.key === "ArrowUp") {
        if (this.buscadorResultadosRow === 0) {
          return;
        }
        this.buscadorResultadosRow--;
      }
      if (ev.key === "ArrowDown") {
        if (this.buscadorResultadosRow === this.buscadorResultadosList.length) {
          return;
        }
        this.buscadorResultadosRow++;
      }
      if (ev.key === "Enter") {
        this.selectBuscadorResultadosRow(
          this.buscadorResultadosList[this.buscadorResultadosRow]
        );
      }
    }
  }

  searchStart(ev: KeyboardEvent = null): void {
    if (
      ev !== null &&
      (ev.key === "ArrowDown" || ev.key === "ArrowUp" || ev.key === "Enter")
    ) {
      ev.preventDefault();
    } else {
      if (this.searchName === "") {
        this.buscadorResultadosList = [];
        this.buscadorResultadosRow = 0;
      } else {
        this.vs.search(this.searchName).subscribe((result) => {
          this.buscadorResultadosList = this.cms.getArticulosBuscador(
            result.list
          );
          this.buscadorResultadosDataSource.data = this.buscadorResultadosList;
        });
      }
    }
  }

  selectBuscadorResultadosRow(row: ArticuloBuscador): void {
    this.muestraBuscador = false;
    this.setFocus(row.localizador);
  }

  abreAccesosDirectos(): void {
    this.ars.getAccesosDirectosList().subscribe((result) => {
      this.accesosDirectosList = this.cms.getAccesosDirectos(result.list);
      this.accesosDirectosDataSource.data = this.accesosDirectosList;
      this.muestraAccesosDirectos = true;
    });
  }

  cerrarAccesosDirectos(ev: MouseEvent = null): void {
    ev && ev.preventDefault();
    this.muestraAccesosDirectos = false;
    this.setFocus();
  }

  selectAccesoDirecto(row: AccesoDirecto): void {
    this.muestraAccesosDirectos = false;
    this.setFocus(row.accesoDirecto);
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
          this.vs.ventaActual.resetearVenta();
          this.vs.addLineaVenta();
        }
      });
  }

  terminarVenta(): void {
    this.endVentaEvent.emit(this.vs.ventaActual.id);
  }

  loadUltimaVenta(importe: number, cambio: number): void {
    this.ultimaVentaImporte = importe;
    this.ultimaVentaCambio = cambio;
    this.showUltimaVenta = true;
  }
}
