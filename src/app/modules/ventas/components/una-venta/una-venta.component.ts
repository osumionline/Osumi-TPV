import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import {
  Component,
  ModelSignal,
  OutputEmitterRef,
  WritableSignal,
  inject,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { ArticuloInterface, ArticuloResult } from '@interfaces/articulo.interface';
import { BuscadorModal, DevolucionModal, VariosModal } from '@interfaces/modals.interface';
import {
  DevolucionSelectedInterface,
  LineasTicketResult,
  LocalizadoresResult,
} from '@interfaces/venta.interface';
import Articulo from '@model/articulos/articulo.model';
import VentaLineaHistorico from '@model/caja/venta-linea-historico.model';
import Cliente from '@model/clientes/cliente.model';
import ApiStatusEnum from '@model/enum/api-status.enum';
import Marca from '@model/marcas/marca.model';
import Empleado from '@model/tpv/empleado.model';
import VentaLinea from '@model/ventas/venta-linea.model';
import Venta from '@model/ventas/venta.model';
import DevolucionModalComponent from '@modules/ventas/components/modals/devolucion-modal/devolucion-modal.component';
import VentaAccesosDirectosModalComponent from '@modules/ventas/components/modals/venta-accesos-directos-modal/venta-accesos-directos-modal.component';
import VentaDescuentoModalComponent from '@modules/ventas/components/modals/venta-descuento-modal/venta-descuento-modal.component';
import VentaVariosModalComponent from '@modules/ventas/components/modals/venta-varios-modal/venta-varios-modal.component';
import { DialogService, Modal, OverlayCloseEvent, OverlayService } from '@osumi/angular-tools';
import ArticulosService from '@services/articulos.service';
import ClassMapperService from '@services/class-mapper.service';
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
  private readonly cms: ClassMapperService = inject(ClassMapperService);
  private readonly dialog: DialogService = inject(DialogService);
  private readonly ms: MarcasService = inject(MarcasService);
  private readonly vs: VentasService = inject(VentasService);
  private readonly ars: ArticulosService = inject(ArticulosService);
  private readonly router: Router = inject(Router);
  private readonly overlayService: OverlayService = inject(OverlayService);

  ind: ModelSignal<number> = model.required<number>();
  venta: ModelSignal<Venta> = model.required<Venta>();
  deleteVentaLineaEvent: OutputEmitterRef<number> = output<number>();
  endVentaEvent: OutputEmitterRef<void> = output<void>();
  openCajaEvent: OutputEmitterRef<void> = output<void>();
  searching: WritableSignal<boolean> = signal<boolean>(false);
  observacionesOpen: boolean = false;
  editarCantidad: boolean = false;
  editarImporte: boolean = false;
  editarDescuento: boolean = false;
  descuentoSelected: number | null = null;

  showClienteEstadisticas: boolean = true;
  showUltimaVenta: boolean = false;
  ultimaVentaImporte: WritableSignal<number> = signal<number>(0);
  ultimaVentaCambio: WritableSignal<number> = signal<number>(0);

  variosInd: number | null = null;

  devolucionVenta: number | null = null;
  devolucionList: DevolucionSelectedInterface[] = [];

  showBuscador: boolean = false;

  loginSuccess(ev: Empleado): void {
    this.venta.update((venta: Venta): Venta => {
      const newVenta: Venta = new Venta().fromInterface(venta.toInterface(), venta.lineas);
      newVenta.setEmpleado(ev);
      newVenta.lineas.push(new VentaLinea());
      newVenta.mostrarEmpleados = false;
      return newVenta;
    });

    this.setFocus(this.venta().loadValue);
  }

  setFocus(value: number | null = null): void {
    if (!this.venta().mostrarEmpleados) {
      this.venta.update((venta: Venta): Venta => {
        venta.loadValue = null;
        return venta;
      });
      setTimeout((): void => {
        const loc: HTMLInputElement = document.getElementById(
          `loc-new-${this.ind()}`
        ) as HTMLInputElement;
        // Si viene valor lo introduzco
        if (value !== null) {
          loc.value = value.toString();
          this.venta.update((venta: Venta): Venta => {
            venta.lineas[venta.lineas.length - 1].localizador = value;
            return venta;
          });
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
      const dialog = this.overlayService.open(BuscadorModalComponent, modalBuscadorData);
      dialog.afterClosed$.subscribe((data): void => {
        this.showBuscador = false;
        if (data.data !== null) {
          // Si es un array, es que se han elegido varias líneas
          if (data.data instanceof Array) {
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
      this.searching.set(true);
      // Si es 0, hay que introducir el artículo Varios
      if (this.venta().lineas[ind].localizador === 0) {
        this.nuevoVarios(ind);
        return;
      }
      // Si el localizador es un número negativo, está escaneando un ticket.
      // Los ids de las ventas son números negativos y hay que abrir ventana de devoluciones
      const localizador: number | null = this.venta().lineas[ind].localizador;
      if (localizador !== null) {
        if (localizador < 0) {
          this.abreDevoluciones(ind);
          return;
        }
        this.ars.loadArticulo(localizador).subscribe((result: ArticuloResult): void => {
          this.searching.set(false);
          if (result.status === ApiStatusEnum.OK) {
            this.loadArticulo(result.articulo, ind);
          } else {
            this.dialog
              .alert({
                title: 'Error',
                content: '¡El código introducido no se encuentra!',
              })
              .subscribe((): void => {
                this.venta.update((venta: Venta): Venta => {
                  venta.lineas[ind].localizador = null;
                  return venta;
                });
                this.setFocus();
              });
          }
        });
      }
    }
  }

  loadArticulo(articuloResult: ArticuloInterface, ind: number): void {
    console.log('loadArticulo', articuloResult, ind);
    const articulo: Articulo = this.cms.getArticulo(articuloResult);
    const marca: Marca | null = this.ms.findById(articulo.idMarca as number);
    if (marca !== null) {
      articulo.marca = marca.nombre;
    }
    const indArticulo: number = this.venta().lineas.findIndex(
      (x: VentaLinea): boolean => x.idArticulo === articulo.id
    );
    console.log({ articulo, indArticulo });

    if (indArticulo === -1) {
      this.venta.update((venta: Venta): Venta => {
        venta.lineas[ind] = new VentaLinea().fromArticulo(articulo);
        venta.lineas.push(new VentaLinea());
        return venta;
      });
    } else {
      if (this.venta().lineas[indArticulo].fromVenta === null) {
        this.venta.update((venta: Venta): Venta => {
          if (venta.lineas[indArticulo].cantidad === null) {
            venta.lineas[indArticulo].cantidad = 0;
          }
          venta.lineas[indArticulo].cantidad++;
          venta.lineas[indArticulo].animarCantidad = true;
          venta.lineas[ind].localizador = null;
          return venta;
        });
        setTimeout((): void => {
          this.venta.update((venta: Venta): Venta => {
            venta.lineas[indArticulo].animarCantidad = false;
            return venta;
          });
        }, 1000);
      } else {
        this.dialog
          .alert({
            title: 'Error',
            content: 'Has seleccionado un artículo que está marcado como devolución.',
          })
          .subscribe((): void => {
            this.venta.update((venta: Venta): Venta => {
              venta.lineas[ind].localizador = null;
              return venta;
            });
            this.setFocus();
            return;
          });
      }
    }
    const cliente: Cliente | null = this.venta().cliente;
    console.log({ cliente });
    if (cliente !== null && cliente.descuento !== 0) {
      this.venta.update((venta: Venta): Venta => {
        venta.lineas[ind].descuentoManual = false;
        venta.lineas[ind].descuento = cliente.descuento;
        return venta;
      });
    }
    this.venta.update((venta: Venta): Venta => {
      venta.updateImporte();
      return venta;
    });
    console.log('setFocus');
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
      const addInd: number = this.venta().lineas.findIndex(
        (x: VentaLinea): boolean => x.localizador === item
      );
      if (addInd === -1) {
        toBeAddded.push(item);
      }
    }

    // Actualizo cantidades
    for (const item of list) {
      const updateInd: number = this.venta().lineas.findIndex(
        (x: VentaLinea): boolean => x.localizador === item
      );
      if (updateInd !== -1) {
        this.venta.update((venta: Venta): Venta => {
          if (venta.lineas[updateInd].cantidad === null) {
            venta.lineas[updateInd].cantidad = 0;
          }
          venta.lineas[updateInd].cantidad++;
          return venta;
        });
      }
    }

    if (toBeAddded.length > 0) {
      this.vs
        .getLocalizadores(toBeAddded.join(','))
        .subscribe((result: LocalizadoresResult): void => {
          const articulos: Articulo[] = this.cms.getArticulos(result.list);
          this.venta.update((venta: Venta): Venta => {
            venta.lineas.splice(venta.lineas.length - 1, 1);
            for (const articulo of articulos) {
              const marca: Marca | null = this.ms.findById(articulo.idMarca as number);
              if (marca !== null) {
                articulo.marca = marca.nombre;
              }
              const ventaLinea: VentaLinea = new VentaLinea().fromArticulo(articulo);
              venta.lineas.push(ventaLinea);
              return venta;
            }
            venta.lineas.push(new VentaLinea());
            return venta;
          });
          this.ind.set(this.venta().lineas.length);
          this.setFocus();
          this.venta.update((venta: Venta): Venta => {
            venta.updateImporte();
            return venta;
          });
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

    this.venta.update((venta: Venta): Venta => {
      venta.lineas[ind] = new VentaLinea().fromArticulo(articulo);
      venta.lineas.push(new VentaLinea());
      return venta;
    });

    this.searching.set(false);
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
          this.searching.set(false);
          this.venta.update((venta: Venta): Venta => {
            venta.lineas[ind].localizador = null;
            return venta;
          });
          this.setFocus();
        });
    } else {
      this.searching.set(false);
      this.devolucionVenta = (this.venta().lineas[ind].localizador ?? 0) * -1;
      this.venta.update((venta: Venta): Venta => {
        venta.lineas[ind].localizador = null;
        return venta;
      });

      const modalDevolucionData: DevolucionModal = {
        modalTitle: 'Devolución',
        modalColor: 'blue',
        idVenta: this.devolucionVenta,
        list: null,
      };
      const dialog = this.overlayService.open(DevolucionModalComponent, modalDevolucionData);
      dialog.afterClosed$.subscribe((data): void => {
        this.afterDevolucion(data);
      });
    }
  }

  mostrarDevolucion(): void {
    const list: DevolucionSelectedInterface[] = [];
    for (const linea of this.venta().lineas) {
      if (linea.fromVenta === this.devolucionVenta) {
        list.push({
          id: linea.id,
          unidades: (linea.cantidad ?? 0) * -1,
        });
      }
    }
    const modalDevolucionData: DevolucionModal = {
      modalTitle: 'Devolución',
      modalColor: 'blue',
      idVenta: this.devolucionVenta,
      list: list,
    };
    const dialog = this.overlayService.open(DevolucionModalComponent, modalDevolucionData);
    dialog.afterClosed$.subscribe(
      (data: OverlayCloseEvent<DevolucionSelectedInterface[]>): void => {
        this.afterDevolucion(data);
      }
    );
  }

  afterDevolucion(data: OverlayCloseEvent<DevolucionSelectedInterface[]>): void {
    const checkList: VentaLinea[] = this.venta().lineas.filter((x: VentaLinea): boolean => {
      return x.fromVenta !== null;
    });

    if (data !== null && data.data.length > 0) {
      // Busco si hay alguna línea que haya que borrar
      const toBeDeleted: number[] = [];
      for (const linea of checkList) {
        if (linea.localizador !== null) {
          const ind: number = data.data.findIndex((x: DevolucionSelectedInterface): boolean => {
            return x.id === linea.id;
          });

          if (ind === -1) {
            toBeDeleted.push(linea.id as number);
          }
        }
      }

      for (const id of toBeDeleted) {
        const deleteInd: number = this.venta().lineas.findIndex((x: VentaLinea): boolean => {
          return x.id === id;
        });
        this.venta.update((venta: Venta): Venta => {
          venta.lineas.splice(deleteInd, 1);
          return venta;
        });
      }

      // Busco líneas nuevas
      const toBeAddded: number[] = [];
      for (const item of data.data) {
        const addInd: number = this.venta().lineas.findIndex(
          (x: VentaLinea): boolean => x.id === item.id
        );
        if (addInd === -1) {
          toBeAddded.push(item.id as number);
        }
      }

      // Actualizo cantidades
      for (const item of data.data) {
        const updateInd: number = this.venta().lineas.findIndex(
          (x: VentaLinea): boolean => x.id === item.id
        );
        if (updateInd !== -1) {
          this.venta.update((venta: Venta): Venta => {
            venta.lineas[updateInd].cantidad = item.unidades;
            return venta;
          });
        }
      }

      this.devolucionList = data.data;
      if (toBeAddded.length > 0) {
        this.vs
          .getLineasTicket(toBeAddded.join(','))
          .subscribe((result: LineasTicketResult): void => {
            const lineas: VentaLineaHistorico[] = this.cms.getHistoricoVentaLineas(result.list);
            this.venta.update((venta: Venta): Venta => {
              venta.lineas.splice(venta.lineas.length - 1, 1);
              return venta;
            });
            for (const linea of lineas) {
              const articulo: Articulo = new Articulo();
              articulo.id = linea.idArticulo !== null ? linea.idArticulo : 0;
              articulo.localizador = linea.localizador !== null ? linea.localizador : 0;
              articulo.nombre = linea.articulo;
              articulo.pvp = linea.pvp;
              articulo.marca = linea.marca;

              const ventaLinea: VentaLinea = new VentaLinea().fromArticulo(articulo);
              ventaLinea.fromVenta = this.devolucionVenta;
              ventaLinea.descuento = linea.descuento;
              const devolucionLinea: DevolucionSelectedInterface | undefined =
                this.devolucionList.find((x: DevolucionSelectedInterface): boolean => {
                  return x.id == linea.id;
                });
              if (devolucionLinea !== undefined) {
                ventaLinea.id = devolucionLinea.id;
                ventaLinea.cantidad = devolucionLinea.unidades;
              }

              this.venta.update((venta: Venta): Venta => {
                venta.lineas.push(ventaLinea);
                return venta;
              });
            }
            this.venta.update((venta: Venta): Venta => {
              venta.lineas.push(new VentaLinea());
              return venta;
            });
            this.ind.set(this.venta().lineas.length);
            this.setFocus();
            this.venta.update((venta: Venta): Venta => {
              venta.updateImporte();
              return venta;
            });
          });
      } else {
        this.ind.set(this.venta().lineas.length);
        this.setFocus();
        this.venta.update((venta: Venta): Venta => {
          venta.updateImporte();
          return venta;
        });
      }
    } else {
      this.devolucionVenta = null;
      this.setFocus();
      this.venta.update((venta: Venta): Venta => {
        venta.updateImporte();
        return venta;
      });
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
      nombre: this.venta().lineas[ind].descripcion,
      pvp: this.venta().lineas[ind].pvp,
      iva: !this.venta().lineas[ind].iva ? 21 : this.venta().lineas[ind].iva,
    };
    const dialog = this.overlayService.open(VentaVariosModalComponent, modalVariosData);
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data !== null) {
        this.venta.update((venta: Venta): Venta => {
          if (this.variosInd !== null) {
            venta.lineas[this.variosInd].descripcion = data.data.nombre;
            venta.lineas[this.variosInd].pvp = data.data.pvp;
            venta.lineas[this.variosInd].iva = data.data.iva;
            venta.updateImporte();
          }
          return venta;
        });
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
    const venta: Venta = this.venta();
    if (!venta.lineas[ind].cantidad) {
      venta.lineas[ind].cantidad = 1;
    }
    venta.updateImporte();
    this.venta.set(venta);
  }

  editarLineaCantidad(i: number): void {
    this.editarCantidad = true;
    setTimeout((): void => {
      const cantidad: HTMLInputElement = document.getElementById(
        'linea-cantidad-' + this.ind + '_' + i
      ) as HTMLInputElement;
      cantidad.select();
    }, 0);
  }

  checkCantidad(): void {
    this.editarCantidad = false;
    this.venta.update((venta: Venta): Venta => {
      venta.updateImporte();
      return venta;
    });
    this.setFocus();
  }

  setRegalo(i: number): void {
    const venta: Venta = this.venta();
    if (!venta.lineas[i].regalo) {
      venta.lineas[i].regalo = true;
      venta.lineas[i].descuentoManualAnterior = venta.lineas[i].descuentoManual;
      venta.lineas[i].descuentoManual = false;
      venta.lineas[i].descuentoAnterior = venta.lineas[i].descuento;
      venta.lineas[i].descuento = 100;
    } else {
      venta.lineas[i].regalo = false;
      venta.lineas[i].descuentoManual = venta.lineas[i].descuentoManualAnterior;
      venta.lineas[i].descuento = venta.lineas[i].descuentoAnterior;
    }
    venta.updateImporte();
    this.venta.set(venta);
  }

  editarLineaImporte(i: number): void {
    const empleado: Empleado | null = this.venta().empleado;
    if (empleado !== null && !empleado.hasRol(rolList['ventas'].roles['modificarImportes'].id)) {
      return;
    }
    if (this.venta().lineas[i].regalo) {
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
    if (this.venta().lineas[i].descuentoManual) {
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

  checkImporte(ind: number): void {
    this.editarImporte = false;
    this.venta.update((venta: Venta): Venta => {
      venta.lineas[ind].importeManual = true;
      venta.updateImporte();
      return venta;
    });
    this.setFocus();
  }

  quitaImporteManual(ev: MouseEvent, ind: number): void {
    ev.stopPropagation();
    this.venta.update((venta: Venta): Venta => {
      venta.lineas[ind].importeManual = false;
      return venta;
    });
    this.setFocus();
  }

  editarLineaDescuento(i: number): void {
    if (this.venta().lineas[i].regalo) {
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
    if (this.venta().lineas[i].importeManual) {
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
    if (this.venta().lineas[i].descuentoManual) {
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

  checkDescuento(ev: Event): void {
    const id: string[] = (ev.target as Element).id.split('_');
    const indId: string | undefined = id.pop();
    if (indId !== undefined) {
      const ind: number = parseInt(indId);
      // Comprobación para que no quede en blanco
      if (this.venta().lineas[ind].descuento === null) {
        this.venta.update((venta: Venta): Venta => {
          venta.lineas[ind].descuento = 0;
          return venta;
        });
      }
    }
    this.editarDescuento = false;
    this.venta.update((venta: Venta): Venta => {
      venta.updateImporte();
      return venta;
    });
    this.setFocus();
  }

  quitaDescuentoManual(ev: MouseEvent, ind: number): void {
    ev.stopPropagation();
    this.venta.update((venta: Venta): Venta => {
      venta.lineas[ind].descuento = 0;
      venta.lineas[ind].descuentoManual = false;
      return venta;
    });
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
    const dialog = this.overlayService.open(VentaDescuentoModalComponent, modalDescuentoData);
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data !== null) {
        const ind: number = this.venta().lineas.findIndex(
          (x: VentaLinea): boolean => x.idArticulo === this.descuentoSelected
        );
        this.venta.update((venta: Venta): Venta => {
          venta.lineas[ind].descuento = data.data;
          venta.lineas[ind].descuentoManual = true;
          venta.updateImporte();
          return venta;
        });
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
          this.venta.update((venta: Venta): Venta => {
            venta.cliente = null;
            venta.resetearVenta();
            venta.lineas.push(new VentaLinea());
            return venta;
          });
          this.setFocus();
        }
      });
  }

  terminarVenta(): void {
    let status: string = 'ok';
    if (this.venta().lineas.length > 0) {
      for (const linea of this.venta().lineas) {
        if (linea.descripcion !== null && (linea.cantidad === null || linea.cantidad === 0)) {
          status = 'error';
          this.dialog.alert({
            title: 'Error',
            content: `¡Atención! La línea ${linea.descripcion} no tiene cantidad asignada.`,
          });
          break;
        }
      }
    }
    if (status === ApiStatusEnum.OK) {
      this.endVentaEvent.emit();
    }
  }

  loadUltimaVenta(importe: number, cambio: number): void {
    this.devolucionVenta = null;
    this.ultimaVentaImporte.set(importe);
    this.ultimaVentaCambio.set(-1 * cambio);
    this.showUltimaVenta = true;
  }

  openCaja(): void {
    this.openCajaEvent.emit();
  }
}
