import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import {
  Component,
  ModelSignal,
  OutputEmitterRef,
  inject,
  model,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import {
  ArticuloInterface,
  ArticuloResult,
} from '@interfaces/articulo.interface';
import {
  BuscadorModal,
  DevolucionModal,
  VariosModal,
} from '@interfaces/modals.interface';
import {
  DevolucionSelectedInterface,
  LineasTicketResult,
  LocalizadoresResult,
} from '@interfaces/venta.interface';
import Articulo from '@model/articulos/articulo.model';
import VentaLineaHistorico from '@model/caja/venta-linea-historico.model';
import Empleado from '@model/tpv/empleado.model';
import VentaLinea from '@model/ventas/venta-linea.model';
import DevolucionModalComponent from '@modules/ventas/components/modals/devolucion-modal/devolucion-modal.component';
import VentaAccesosDirectosModalComponent from '@modules/ventas/components/modals/venta-accesos-directos-modal/venta-accesos-directos-modal.component';
import VentaDescuentoModalComponent from '@modules/ventas/components/modals/venta-descuento-modal/venta-descuento-modal.component';
import VentaVariosModalComponent from '@modules/ventas/components/modals/venta-varios-modal/venta-varios-modal.component';
import { DialogService, Modal, OverlayService } from '@osumi/angular-tools';
import ArticulosService from '@services/articulos.service';
import ClassMapperService from '@services/class-mapper.service';
import EmpleadosService from '@services/empleados.service';
import MarcasService from '@services/marcas.service';
import VentasService from '@services/ventas.service';
import EmployeeLoginComponent from '@shared/components/employee-login/employee-login.component';
import BuscadorModalComponent from '@shared/components/modals/buscador-modal/buscador-modal.component';
import FixedNumberPipe from '@shared/pipes/fixed-number.pipe';
import { rolList } from '@shared/rol.class';

@Component({
  selector: 'otpv-una-venta',
  templateUrl: './una-venta.component.html',
  styleUrls: ['./una-venta.component.scss'],
  imports: [
    FormsModule,
    FixedNumberPipe,
    EmployeeLoginComponent,
    MatIcon,
    MatTooltip,
    MatButton,
    CdkDrag,
    CdkDragHandle,
  ],
})
export default class UnaVentaComponent {
  private cms: ClassMapperService = inject(ClassMapperService);
  private dialog: DialogService = inject(DialogService);
  private ms: MarcasService = inject(MarcasService);
  public vs: VentasService = inject(VentasService);
  private ars: ArticulosService = inject(ArticulosService);
  public es: EmpleadosService = inject(EmpleadosService);
  private router: Router = inject(Router);
  private overlayService: OverlayService = inject(OverlayService);

  ind: ModelSignal<number> = model.required<number>();
  deleteVentaLineaEvent: OutputEmitterRef<number> = output<number>();
  endVentaEvent: OutputEmitterRef<void> = output<void>();
  openCajaEvent: OutputEmitterRef<void> = output<void>();
  searching: boolean = false;
  observacionesOpen: boolean = false;
  editarCantidad: boolean = false;
  editarImporte: boolean = false;
  editarDescuento: boolean = false;
  descuentoSelected: number = null;

  showClienteEstadisticas: boolean = true;
  showUltimaVenta: boolean = false;
  ultimaVentaImporte: number = null;
  ultimaVentaCambio: number = null;

  variosInd: number = null;

  devolucionVenta: number = null;
  devolucionList: DevolucionSelectedInterface[] = [];

  showBuscador: boolean = false;

  loginSuccess(ev: Empleado): void {
    this.vs.ventaActual.setEmpleado(ev);
    this.vs.addLineaVenta();
    this.vs.ventaActual.mostrarEmpleados = false;

    this.setFocus(this.vs.ventaActual.loadValue);
  }

  setFocus(value: number = null): void {
    if (!this.vs.ventaActual.mostrarEmpleados) {
      this.vs.ventaActual.loadValue = null;
      setTimeout(() => {
        const loc: HTMLInputElement = document.getElementById(
          `loc-new-${this.ind()}`
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
          const ev: KeyboardEvent = new KeyboardEvent('keydown', {
            code: 'Enter',
            key: 'Enter',
            keyCode: 13,
            which: 13,
          });
          loc.dispatchEvent(ev);
        }
      }, 0);
    }
  }

  checkLocalizador(ev: KeyboardEvent, ind: number): void {
    if (this.showBuscador) {
      return;
    }
    const letters = /^[a-zA-Z]{1}$/;
    if (ev.key.match(letters) && !ev.ctrlKey) {
      ev.preventDefault();

      this.showBuscador = true;
      const modalBuscadorData: BuscadorModal = {
        modalTitle: 'Buscador',
        modalColor: 'blue',
        css: 'modal-wide',
        key: ev.key,
        showSelect: true,
      };
      const dialog = this.overlayService.open(
        BuscadorModalComponent,
        modalBuscadorData
      );
      dialog.afterClosed$.subscribe((data): void => {
        this.showBuscador = false;
        if (data.data !== null) {
          // Si es un array, es que se han elegido varias líneas
          if (data.data instanceof Array) {
            console.log(data);
            this.loadMultiArticulos(data.data);
          } else {
            // Si no es un array, es que se ha elegido una línea
            this.setFocus(data.data);
          }
        } else {
          this.setFocus();
        }
      });

      return;
    }
    if (ev.key === 'Enter' && !this.observacionesOpen) {
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
        .subscribe((result: ArticuloResult): void => {
          this.searching = false;
          if (result.status === 'ok') {
            this.loadArticulo(result.articulo, ind);
          } else {
            this.dialog
              .alert({
                title: 'Error',
                content: '¡El código introducido no se encuentra!',
              })
              .subscribe((): void => {
                this.vs.ventaActual.lineas[ind].localizador = null;
                this.setFocus();
              });
          }
        });
    }
  }

  loadArticulo(articuloResult: ArticuloInterface, ind: number): void {
    const articulo = this.cms.getArticulo(articuloResult);
    const marca = this.ms.findById(articulo.idMarca);
    articulo.marca = marca.nombre;
    const indArticulo: number = this.vs.ventaActual.lineas.findIndex(
      (x: VentaLinea): boolean => x.idArticulo === articulo.id
    );

    if (indArticulo === -1) {
      this.vs.ventaActual.lineas[ind] = new VentaLinea().fromArticulo(articulo);
      this.vs.addLineaVenta();
    } else {
      if (this.vs.ventaActual.lineas[indArticulo].fromVenta === null) {
        this.vs.ventaActual.lineas[indArticulo].cantidad++;
        this.vs.ventaActual.lineas[indArticulo].animarCantidad = true;
        this.vs.ventaActual.lineas[ind].localizador = null;
        setTimeout((): void => {
          this.vs.ventaActual.lineas[indArticulo].animarCantidad = false;
        }, 1000);
      } else {
        this.dialog
          .alert({
            title: 'Error',
            content:
              'Has seleccionado un artículo que está marcado como devolución.',
          })
          .subscribe((): void => {
            this.vs.ventaActual.lineas[ind].localizador = null;
            this.setFocus();
            return;
          });
      }
    }
    if (this.vs.cliente !== null && this.vs.cliente.descuento !== 0) {
      this.vs.ventaActual.lineas[ind].descuentoManual = false;
      this.vs.ventaActual.lineas[ind].descuento = this.vs.cliente.descuento;
    }
    this.vs.ventaActual.updateImporte();
    this.setFocus();

    if (articulo.mostrarObsVentas && articulo.observaciones) {
      this.dialog
        .alert({
          title: 'Observaciones',
          content: articulo.observaciones,
        })
        .subscribe((): void => {
          this.setFocus();
        });
    }
  }

  loadMultiArticulos(list: number[]): void {
    // Busco líneas nuevas
    const toBeAddded: number[] = [];
    for (const item of list) {
      const addInd: number = this.vs.ventaActual.lineas.findIndex(
        (x: VentaLinea): boolean => x.localizador === item
      );
      if (addInd === -1) {
        toBeAddded.push(item);
      }
    }

    // Actualizo cantidades
    for (const item of list) {
      const updateInd: number = this.vs.ventaActual.lineas.findIndex(
        (x: VentaLinea): boolean => x.localizador === item
      );
      if (updateInd !== -1) {
        this.vs.ventaActual.lineas[updateInd].cantidad++;
      }
    }

    if (toBeAddded.length > 0) {
      this.vs
        .getLocalizadores(toBeAddded.join(','))
        .subscribe((result: LocalizadoresResult): void => {
          const articulos: Articulo[] = this.cms.getArticulos(result.list);
          this.vs.ventaActual.lineas.splice(
            this.vs.ventaActual.lineas.length - 1,
            1
          );
          for (const articulo of articulos) {
            const marca = this.ms.findById(articulo.idMarca);
            articulo.marca = marca.nombre;
            const ventaLinea: VentaLinea = new VentaLinea().fromArticulo(
              articulo
            );
            this.vs.ventaActual.lineas.push(ventaLinea);
          }
          this.vs.addLineaVenta();
          this.ind.set(this.vs.ventaActual.lineas.length);
          this.setFocus();
          this.vs.ventaActual.updateImporte();
        });
    }
  }

  nuevoVarios(ind: number): void {
    const articulo: Articulo = new Articulo();
    articulo.id = 0;
    articulo.localizador = 0;
    articulo.nombre = 'Varios';
    articulo.pvp = 0;
    articulo.marca = 'Varios';

    this.vs.ventaActual.lineas[ind] = new VentaLinea().fromArticulo(articulo);

    this.vs.addLineaVenta();
    this.searching = false;
    this.abreVarios(ind);
  }

  abreDevoluciones(ind: number): void {
    if (this.devolucionVenta !== null) {
      this.dialog
        .alert({
          title: 'Error',
          content:
            '¡Atención! No puedes realizar una nueva devolución hasta haber terminado la actual.',
        })
        .subscribe((): void => {
          this.searching = false;
          this.vs.ventaActual.lineas[ind].localizador = null;
          this.setFocus();
        });
    } else {
      this.searching = false;
      this.devolucionVenta = this.vs.ventaActual.lineas[ind].localizador * -1;
      this.vs.ventaActual.lineas[ind].localizador = null;

      const modalDevolucionData: DevolucionModal = {
        modalTitle: 'Devolución',
        modalColor: 'blue',
        idVenta: this.devolucionVenta,
        list: null,
      };
      const dialog = this.overlayService.open(
        DevolucionModalComponent,
        modalDevolucionData
      );
      dialog.afterClosed$.subscribe((data): void => {
        this.afterDevolucion(data);
      });
    }
  }

  mostrarDevolucion(): void {
    const list: DevolucionSelectedInterface[] = [];
    for (const linea of this.vs.ventaActual.lineas) {
      if (linea.fromVenta === this.devolucionVenta) {
        list.push({
          id: linea.id,
          unidades: linea.cantidad * -1,
        });
      }
    }
    const modalDevolucionData: DevolucionModal = {
      modalTitle: 'Devolución',
      modalColor: 'blue',
      idVenta: this.devolucionVenta,
      list: list,
    };
    const dialog = this.overlayService.open(
      DevolucionModalComponent,
      modalDevolucionData
    );
    dialog.afterClosed$.subscribe((data): void => {
      this.afterDevolucion(data);
    });
  }

  afterDevolucion(data): void {
    const checkList: VentaLinea[] = this.vs.ventaActual.lineas.filter(
      (x: VentaLinea): boolean => {
        return x.fromVenta !== null;
      }
    );

    if (data !== null && data.data.length > 0) {
      // Busco si hay alguna línea que haya que borrar
      const toBeDeleted: number[] = [];
      for (const linea of checkList) {
        if (linea.localizador !== null) {
          const ind: number = data.data.findIndex(
            (x: DevolucionSelectedInterface): boolean => {
              return x.id === linea.id;
            }
          );

          if (ind === -1) {
            toBeDeleted.push(linea.id);
          }
        }
      }

      for (const id of toBeDeleted) {
        const deleteInd: number = this.vs.ventaActual.lineas.findIndex(
          (x: VentaLinea): boolean => {
            return x.id === id;
          }
        );
        this.vs.ventaActual.lineas.splice(deleteInd, 1);
      }

      // Busco líneas nuevas
      const toBeAddded: number[] = [];
      for (const item of data.data) {
        const addInd: number = this.vs.ventaActual.lineas.findIndex(
          (x: VentaLinea): boolean => x.id === item.id
        );
        if (addInd === -1) {
          toBeAddded.push(item.id);
        }
      }

      // Actualizo cantidades
      for (const item of data.data) {
        const updateInd: number = this.vs.ventaActual.lineas.findIndex(
          (x: VentaLinea): boolean => x.id === item.id
        );
        if (updateInd !== -1) {
          this.vs.ventaActual.lineas[updateInd].cantidad = item.unidades;
        }
      }

      this.devolucionList = data.data;
      if (toBeAddded.length > 0) {
        this.vs
          .getLineasTicket(toBeAddded.join(','))
          .subscribe((result: LineasTicketResult): void => {
            const lineas: VentaLineaHistorico[] =
              this.cms.getHistoricoVentaLineas(result.list);
            this.vs.ventaActual.lineas.splice(
              this.vs.ventaActual.lineas.length - 1,
              1
            );
            for (const linea of lineas) {
              const articulo: Articulo = new Articulo();
              articulo.id = linea.idArticulo !== null ? linea.idArticulo : 0;
              articulo.localizador =
                linea.localizador !== null ? linea.localizador : 0;
              articulo.nombre = linea.articulo;
              articulo.pvp = linea.pvp;
              articulo.marca = linea.marca;

              const ventaLinea: VentaLinea = new VentaLinea().fromArticulo(
                articulo
              );
              ventaLinea.fromVenta = this.devolucionVenta;
              ventaLinea.descuento = linea.descuento;
              const devolucionLinea: DevolucionSelectedInterface =
                this.devolucionList.find(
                  (x: DevolucionSelectedInterface): boolean => {
                    return x.id == linea.id;
                  }
                );
              ventaLinea.id = devolucionLinea.id;
              ventaLinea.cantidad = devolucionLinea.unidades;

              this.vs.ventaActual.lineas.push(ventaLinea);
            }
            this.vs.addLineaVenta();
            this.ind.set(this.vs.ventaActual.lineas.length);
            this.setFocus();
            this.vs.ventaActual.updateImporte();
          });
      } else {
        this.ind.set(this.vs.ventaActual.lineas.length);
        this.setFocus();
        this.vs.ventaActual.updateImporte();
      }
    } else {
      this.devolucionVenta = null;
      this.setFocus();
      this.vs.ventaActual.updateImporte();
    }
  }

  borraLinea(ind: number): void {
    this.dialog
      .confirm({
        title: '¡Atención!',
        content: '¿Está seguro de querer borrar esta línea?',
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.deleteVentaLineaEvent.emit(ind);
        }
      });
  }

  goToArticulo(linea: VentaLinea, ind: number): void {
    if (linea.idArticulo !== 0) {
      this.ars.returnInfo = {
        where: 'ventas',
        id: null,
        extra: null,
      };
      this.ars.newArticulo(linea.localizador);
      this.router.navigate(['/articulos']);
    } else {
      this.abreVarios(ind);
    }
  }

  abreVarios(ind: number): void {
    this.variosInd = ind;

    const modalVariosData: VariosModal = {
      modalTitle: 'Introducir Varios',
      modalColor: 'blue',
      nombre: this.vs.ventaActual.lineas[ind].descripcion,
      pvp: this.vs.ventaActual.lineas[ind].pvp,
      iva: !this.vs.ventaActual.lineas[ind].iva
        ? 21
        : this.vs.ventaActual.lineas[ind].iva,
    };
    const dialog = this.overlayService.open(
      VentaVariosModalComponent,
      modalVariosData
    );
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data !== null) {
        this.vs.ventaActual.lineas[this.variosInd].descripcion =
          data.data.nombre;
        this.vs.ventaActual.lineas[this.variosInd].pvp = data.data.pvp;
        this.vs.ventaActual.lineas[this.variosInd].iva = data.data.iva;
        this.vs.ventaActual.updateImporte();
      }
      this.setFocus();
    });
  }

  showObservaciones(ev: MouseEvent, observaciones: string): void {
    ev.stopPropagation();
    this.observacionesOpen = true;
    this.dialog
      .alert({
        title: 'Observaciones',
        content: observaciones,
      })
      .subscribe((): void => {
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
        'linea-cantidad-' + this.ind + '_' + i
      ) as HTMLInputElement;
      cantidad.select();
    }, 0);
  }

  checkCantidad(ev: KeyboardEvent, ind: number, close: boolean): void {
    if (ev.key == 'Enter' || close) {
      this.editarCantidad = false;
      this.vs.ventaActual.updateImporte();
      this.setFocus();
    }
  }

  setRegalo(i: number): void {
    console.log(this.vs.ventaActual.lineas[i]);
    if (!this.vs.ventaActual.lineas[i].regalo) {
      this.vs.ventaActual.lineas[i].regalo = true;
      this.vs.ventaActual.lineas[i].descuentoManualAnterior =
        this.vs.ventaActual.lineas[i].descuentoManual;
      this.vs.ventaActual.lineas[i].descuentoManual = false;
      this.vs.ventaActual.lineas[i].descuentoAnterior =
        this.vs.ventaActual.lineas[i].descuento;
      this.vs.ventaActual.lineas[i].descuento = 100;
    } else {
      this.vs.ventaActual.lineas[i].regalo = false;
      this.vs.ventaActual.lineas[i].descuentoManual =
        this.vs.ventaActual.lineas[i].descuentoManualAnterior;
      this.vs.ventaActual.lineas[i].descuento =
        this.vs.ventaActual.lineas[i].descuentoAnterior;
    }
    this.vs.ventaActual.updateImporte();
  }

  editarLineaImporte(i: number): void {
    if (
      !this.vs.ventaActual.empleado.hasRol(
        rolList.ventas.roles['modificarImportes'].id
      )
    ) {
      return;
    }
    if (this.vs.ventaActual.lineas[i].regalo) {
      this.dialog
        .alert({
          title: 'Atención',
          content:
            'La línea se ha marcado como "regalo", de modo que no se puede modificar su importe',
        })
        .subscribe((): void => {
          this.setFocus();
        });
      return;
    }
    if (this.vs.ventaActual.lineas[i].descuentoManual) {
      this.dialog
        .alert({
          title: 'Atención',
          content:
            'Se ha introducido un descuento a mano para el artículo, de modo que no se puede introducir un importe',
        })
        .subscribe((): void => {
          this.setFocus();
        });
      return;
    }
    this.editarImporte = true;
    setTimeout((): void => {
      const importe: HTMLInputElement = document.getElementById(
        'linea-importe-' + this.ind + '_' + i
      ) as HTMLInputElement;
      importe.select();
    }, 0);
  }

  checkImporte(ev: KeyboardEvent, ind: number, close: boolean): void {
    if (ev.key == 'Enter' || close) {
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
    if (this.vs.ventaActual.lineas[i].regalo) {
      this.dialog
        .alert({
          title: 'Atención',
          content:
            'La línea se ha marcado como "regalo", de modo que no se puede modificar su descuento',
        })
        .subscribe((): void => {
          this.setFocus();
        });
      return;
    }
    if (this.vs.ventaActual.lineas[i].importeManual) {
      this.dialog
        .alert({
          title: 'Atención',
          content:
            'Se ha introducido un importe a mano para el artículo, de modo que no se puede introducir un descuento',
        })
        .subscribe((): void => {
          this.setFocus();
        });
      return;
    }
    if (this.vs.ventaActual.lineas[i].descuentoManual) {
      this.dialog
        .alert({
          title: 'Atención',
          content:
            'Se ha introducido un descuento a mano para el artículo, de modo que no se puede introducir un importe',
        })
        .subscribe((): void => {
          this.setFocus();
        });
      return;
    }
    this.editarDescuento = true;
    setTimeout((): void => {
      const descuento: HTMLInputElement = document.getElementById(
        'linea-descuento-' + this.ind + '_' + i
      ) as HTMLInputElement;
      descuento.select();
    }, 0);
  }

  checkDescuento(ev: KeyboardEvent, close: boolean): void {
    if (ev.key == 'Enter' || close) {
      const id: string[] = (ev.target as Element).id.split('_');
      const ind: number = parseInt(id.pop());
      // Comprobación para que no quede en blanco
      if (this.vs.ventaActual.lineas[ind].descuento === null) {
        this.vs.ventaActual.lineas[ind].descuento = 0;
      }
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
    if (linea.regalo) {
      this.dialog
        .alert({
          title: 'Atención',
          content:
            'La línea se ha marcado como "regalo", de modo que no se puede modificar su descuento',
        })
        .subscribe((): void => {
          this.setFocus();
        });
      return;
    }
    this.descuentoSelected = linea.idArticulo;

    const modalDescuentoData: Modal = {
      modalTitle: 'Introducir descuento',
      modalColor: 'blue',
    };
    const dialog = this.overlayService.open(
      VentaDescuentoModalComponent,
      modalDescuentoData
    );
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data !== null) {
        const ind: number = this.vs.ventaActual.lineas.findIndex(
          (x: VentaLinea): boolean => x.idArticulo === this.descuentoSelected
        );
        this.vs.ventaActual.lineas[ind].descuento = data.data;
        this.vs.ventaActual.lineas[ind].descuentoManual = true;
        this.vs.ventaActual.updateImporte();
      }
    });
  }

  closeClienteEstadisticas(): void {
    this.showClienteEstadisticas = !this.showClienteEstadisticas;
  }

  abreAccesosDirectos(): void {
    const modalAccesosDirectosData: Modal = {
      modalTitle: 'Accesos Directos',
      modalColor: 'blue',
    };
    const dialog = this.overlayService.open(
      VentaAccesosDirectosModalComponent,
      modalAccesosDirectosData
    );
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data !== null) {
        this.setFocus(data.data);
      } else {
        this.setFocus();
      }
    });
  }

  cancelarVenta(): void {
    this.dialog
      .confirm({
        title: 'Confirmar',
        content: '¿Estás seguro de querer cancelar esta venta?',
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.devolucionVenta = null;
          this.vs.cliente = null;
          this.vs.ventaActual.resetearVenta();
          this.vs.addLineaVenta();
          this.setFocus();
        }
      });
  }

  terminarVenta(): void {
    let status: string = 'ok';
    if (this.vs.ventaActual.lineas.length > 0) {
      for (const linea of this.vs.ventaActual.lineas) {
        if (
          linea.descripcion !== null &&
          (linea.cantidad === null || linea.cantidad === 0)
        ) {
          status = 'error';
          this.dialog.alert({
            title: 'Error',
            content: `¡Atención! La línea ${linea.descripcion} no tiene cantidad asignada.`,
          });
          break;
        }
      }
    }
    if (status === 'ok') {
      this.endVentaEvent.emit();
    }
  }

  loadUltimaVenta(importe: number, cambio: number): void {
    this.devolucionVenta = null;
    this.ultimaVentaImporte = importe;
    this.ultimaVentaCambio = -1 * cambio;
    this.showUltimaVenta = true;
  }

  openCaja(): void {
    this.openCajaEvent.emit();
  }
}
