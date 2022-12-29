import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { DevolucionComponent } from "src/app/components/devolucion/devolucion.component";
import { DevolucionSelectedInterface } from "src/app/interfaces/venta.interface";
import { AccesoDirecto } from "src/app/model/acceso-directo.model";
import { ArticuloBuscador } from "src/app/model/articulo-buscador.model";
import { Articulo } from "src/app/model/articulo.model";
import { Empleado } from "src/app/model/empleado.model";
import { IVAOption } from "src/app/model/iva-option.model";
import { VentaLinea } from "src/app/model/venta-linea.model";
import { ArticulosService } from "src/app/services/articulos.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ConfigService } from "src/app/services/config.service";
import { DialogService } from "src/app/services/dialog.service";
import { EmpleadosService } from "src/app/services/empleados.service";
import { MarcasService } from "src/app/services/marcas.service";
import { VentasService } from "src/app/services/ventas.service";
import { rolList } from "src/app/shared/rol.class";
import { ArticuloInterface } from "./../../interfaces/articulo.interface";

@Component({
  selector: "otpv-una-venta",
  templateUrl: "./una-venta.component.html",
  styleUrls: ["./una-venta.component.scss"],
})
export class UnaVentaComponent implements OnInit, AfterViewInit {
  @Input() ind: number = null;
  @Output() deleteVentaLineaEvent: EventEmitter<number> =
    new EventEmitter<number>();
  @Output() endVentaEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() openCajaEvent: EventEmitter<number> = new EventEmitter<number>();
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

  muestraVarios: boolean = false;
  variosInd: number = null;
  tipoIva: string = "iva";
  ivaOptions: IVAOption[] = [];
  selectedIvaOption: IVAOption = new IVAOption();
  formVarios: FormGroup = new FormGroup({
    nombre: new FormControl(null, Validators.required),
    pvp: new FormControl(null),
  });
  @ViewChild("variosPVPbox", { static: true }) variosPVPbox: ElementRef;

  devolucionVenta: number = null;
  @ViewChild("devolucion", { static: true }) devolucion: DevolucionComponent;
  devolucionList: DevolucionSelectedInterface[] = [];

  constructor(
    private cms: ClassMapperService,
    private dialog: DialogService,
    private ms: MarcasService,
    public vs: VentasService,
    private ars: ArticulosService,
    public es: EmpleadosService,
    private config: ConfigService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tipoIva = this.config.tipoIva;
    this.ivaOptions = this.config.ivaOptions;
    this.selectedIvaOption = new IVAOption(
      this.tipoIva,
      21,
      this.tipoIva === "re" ? 5.2 : -1
    );
  }

  ngAfterViewInit(): void {
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
      // Si es 0, hay que introducir el artículo Varios
      if (this.vs.ventaActual.lineas[ind].localizador == 0) {
        this.nuevoVarios(ind);
        return;
      }
      // Si el localizador es un número negativo, está escaneando un ticket.
      // Los ids de las ventas son números negativos y hay que abrir ventana de devoluciones
      if (this.vs.ventaActual.lineas[ind].localizador < 0) {
        this.abreDevoluciones(ind);
        return;
      }
      this.ars
        .loadArticulo(this.vs.ventaActual.lineas[ind].localizador)
        .subscribe((result) => {
          this.searching = false;
          if (result.status === "ok") {
            this.loadArticulo(result.articulo, ind);
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

  loadArticulo(
    articuloResult: ArticuloInterface,
    ind: number,
    devolucion: DevolucionSelectedInterface = null
  ): void {
    const articulo = this.cms.getArticulo(articuloResult);
    const marca = this.ms.findById(articulo.idMarca);
    articulo.marca = marca.nombre;
    const indArticulo: number = this.vs.ventaActual.lineas.findIndex(
      (x: VentaLinea): boolean => x.idArticulo === articulo.id
    );

    if (indArticulo === -1) {
      this.vs.ventaActual.lineas[ind] = new VentaLinea().fromArticulo(articulo);
      if (devolucion !== null) {
        this.vs.ventaActual.lineas[ind].cantidad = devolucion.unidades;
        this.vs.ventaActual.lineas[ind].fromVenta = this.devolucionVenta;
      }
      this.vs.addLineaVenta();
    } else {
      if (this.vs.ventaActual.lineas[indArticulo].fromVenta === null) {
        this.vs.ventaActual.lineas[indArticulo].cantidad++;
        this.vs.ventaActual.lineas[ind].localizador = null;
      } else {
        this.dialog
          .alert({
            title: "Error",
            content:
              "Has seleccionado un artículo que está marcado como devolución.",
            ok: "Continuar",
          })
          .subscribe((result) => {
            this.vs.ventaActual.lineas[ind].localizador = null;
            this.setFocus();
            return;
          });
      }
    }
    this.vs.ventaActual.updateImporte();
    this.setFocus();

    if (
      devolucion === null &&
      articulo.mostrarObsVentas &&
      articulo.observaciones
    ) {
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
    if (devolucion !== null) {
      this.loadNextDevolucion();
    }
  }

  nuevoVarios(ind: number): void {
    const articulo: Articulo = new Articulo();
    articulo.id = 0;
    articulo.localizador = 0;
    articulo.nombre = "Varios";
    articulo.pvp = 0;
    articulo.marca = "Varios";

    this.vs.ventaActual.lineas[ind] = new VentaLinea().fromArticulo(articulo);

    this.vs.addLineaVenta();
    this.searching = false;
    this.abreVarios(ind);
  }

  abreDevoluciones(ind: number): void {
    if (this.devolucionVenta !== null) {
      this.dialog
        .alert({
          title: "Error",
          content:
            "¡Atención! No puedes realizar una nueva devolución hasta haber terminado la actual.",
          ok: "Continuar",
        })
        .subscribe((result) => {
          this.searching = false;
          this.vs.ventaActual.lineas[ind].localizador = null;
          this.setFocus();
        });
    } else {
      this.devolucionVenta = this.vs.ventaActual.lineas[ind].localizador * -1;
      this.devolucion.newDevolucion(this.devolucionVenta);
      this.searching = false;
      this.vs.ventaActual.lineas[ind].localizador = null;
    }
  }

  mostrarDevolucion(): void {
    const list: DevolucionSelectedInterface[] = [];
    for (let linea of this.vs.ventaActual.lineas) {
      if (linea.fromVenta === this.devolucionVenta) {
        list.push({
          localizador: linea.localizador,
          unidades: linea.cantidad * -1,
        });
      }
    }
    this.devolucion.continueDevolucion(this.devolucionVenta, list);
  }

  continuarDevolucion(list: DevolucionSelectedInterface[]): void {
    if (list.length > 0) {
      this.devolucionList = list;
      this.loadNextDevolucion();
    } else {
      this.devolucionVenta = null;
      this.setFocus();
    }
  }

  loadNextDevolucion(): void {
    if (this.devolucionList.length > 0) {
      const item: DevolucionSelectedInterface = this.devolucionList.shift();
      const ind: number = this.vs.ventaActual.lineas.findIndex(
        (x: VentaLinea): boolean => {
          return (
            x.localizador === item.localizador &&
            x.fromVenta === this.devolucionVenta
          );
        }
      );
      if (ind != -1) {
        this.vs.ventaActual.lineas[ind].cantidad = item.unidades;
        this.vs.ventaActual.updateImporte();
      } else {
        this.ars.loadArticulo(item.localizador).subscribe((result) => {
          this.loadArticulo(
            result.articulo,
            this.vs.ventaActual.lineas.length - 1,
            item
          );
        });
      }
    } else {
      this.setFocus();
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

  goToArticulo(linea: VentaLinea, ind: number): void {
    if (linea.idArticulo !== 0) {
      this.router.navigate([
        "/articulos",
        linea.localizador,
        "return",
        "ventas",
      ]);
    } else {
      this.abreVarios(ind);
    }
  }

  abreVarios(ind: number): void {
    this.formVarios
      .get("nombre")
      .setValue(this.vs.ventaActual.lineas[ind].descripcion);
    this.formVarios.get("pvp").setValue(this.vs.ventaActual.lineas[ind].pvp);
    this.variosInd = ind;
    this.muestraVarios = true;
    setTimeout(() => {
      this.variosPVPbox.nativeElement.focus();
    }, 0);
  }

  cerrarVarios(ev: MouseEvent = null): void {
    ev && ev.preventDefault();
    this.muestraVarios = false;
  }

  updateIvaRe(ev: string): void {
    const ivaInd: number = this.config.ivaOptions.findIndex(
      (x: IVAOption): boolean => x.id == ev
    );
    this.selectedIvaOption.updateValues(
      this.config.ivaOptions[ivaInd].iva,
      this.config.ivaOptions[ivaInd].re
    );
  }

  actualizarVarios(): void {
    this.vs.ventaActual.lineas[this.variosInd].descripcion =
      this.formVarios.get("nombre").value;
    this.vs.ventaActual.lineas[this.variosInd].pvp =
      this.formVarios.get("pvp").value;
    this.vs.ventaActual.lineas[this.variosInd].iva = this.selectedIvaOption.iva;
    this.vs.ventaActual.lineas[this.variosInd].re =
      this.selectedIvaOption.re !== -1 ? this.selectedIvaOption.re : null;
    this.vs.ventaActual.updateImporte();
    this.cerrarVarios();
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

  abreDescuento(ev: MouseEvent, linea: VentaLinea): void {
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
          this.devolucionVenta = null;
          this.vs.ventaActual.resetearVenta();
          this.vs.addLineaVenta();
          this.setFocus();
        }
      });
  }

  terminarVenta(): void {
    this.endVentaEvent.emit(this.vs.ventaActual.id);
  }

  loadUltimaVenta(importe: number, cambio: number): void {
    this.devolucionVenta = null;
    this.ultimaVentaImporte = importe;
    this.ultimaVentaCambio = -1 * cambio;
    this.showUltimaVenta = true;
  }

  openCaja(): void {
    this.openCajaEvent.emit(0);
  }
}
