import { NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatList, MatListItem } from '@angular/material/list';
import { MatSelect } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from '@env/environment';
import { ArticuloResult } from '@interfaces/articulo.interface';
import { StatusResult } from '@interfaces/interfaces';
import { BuscadorModal } from '@interfaces/modals.interface';
import {
  PedidoResult,
  PedidoSaveResult,
  PedidosColOption,
} from '@interfaces/pedido.interface';
import Articulo from '@model/articulos/articulo.model';
import PedidoLinea from '@model/compras/pedido-linea.model';
import PedidoPDF from '@model/compras/pedido-pdf.model';
import PedidoVista from '@model/compras/pedido-vista.model';
import Pedido from '@model/compras/pedido.model';
import Marca from '@model/marcas/marca.model';
import IVAOption from '@model/tpv/iva-option.model';
import { DialogService, Modal, OverlayService } from '@osumi/angular-tools';
import {
  getDate,
  getDateFromString,
  getTwoNumberDecimal,
  urldecode,
} from '@osumi/tools';
import ArticulosService from '@services/articulos.service';
import ClassMapperService from '@services/class-mapper.service';
import ComprasService from '@services/compras.service';
import ConfigService from '@services/config.service';
import MarcasService from '@services/marcas.service';
import ProveedoresService from '@services/proveedores.service';
import HeaderComponent from '@shared/components/header/header.component';
import BuscadorModalComponent from '@shared/components/modals/buscador-modal/buscador-modal.component';
import NewProveedorModalComponent from '@shared/components/modals/new-proveedor-modal/new-proveedor-modal.component';
import FixedNumberPipe from '@shared/pipes/fixed-number.pipe';

@Component({
  selector: 'otpv-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.scss'],
  imports: [
    NgClass,
    FormsModule,
    MatSortModule,
    HeaderComponent,
    FixedNumberPipe,
    MatCard,
    MatCardContent,
    MatButton,
    MatIconButton,
    MatIcon,
    MatFormFieldModule,
    MatInput,
    MatSelect,
    MatOption,
    MatCheckbox,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatTooltip,
    MatList,
    MatListItem,
  ],
})
export default class PedidoComponent implements OnInit, OnDestroy {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  public config: ConfigService = inject(ConfigService);
  public ps: ProveedoresService = inject(ProveedoresService);
  private ars: ArticulosService = inject(ArticulosService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private dialog: DialogService = inject(DialogService);
  private ms: MarcasService = inject(MarcasService);
  private cs: ComprasService = inject(ComprasService);
  private router: Router = inject(Router);
  private overlayService: OverlayService = inject(OverlayService);
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  titulo: string = 'Nuevo pedido';
  pedido: Pedido = new Pedido();

  dontSave: boolean = false;

  @ViewChild('proveedoresValue', { static: true }) proveedoresValue: MatSelect;
  fechaPedido: Date = new Date();
  fechaPago: Date = new Date();
  @ViewChild('numAlbaranFacturaBox', { static: true })
  numAlbaranFacturaBox: ElementRef;

  ivaOptions: IVAOption[] = [];
  ivaList: number[] = [];
  reList: number[] = [];

  metodosPago: string[] = [
    'Domiciliación bancaria',
    'Tarjeta',
    'Paypal',
    'Al contado',
    'Transferencia bancaria',
  ];

  @ViewChild('allSelected') private allSelected: MatOption;
  colOptions: PedidosColOption[] = [
    {
      id: 1,
      value: 'Ordenar',
      colname: 'ordenar',
      selected: true,
      default: false,
    },
    {
      id: 2,
      value: 'Localizador',
      colname: 'localizador',
      selected: true,
      default: true,
    },
    {
      id: 3,
      value: 'Descripción',
      colname: 'nombreArticulo',
      selected: true,
      default: true,
    },
    {
      id: 4,
      value: 'Referencia',
      colname: 'referencia',
      selected: false,
      default: false,
    },
    { id: 5, value: 'Marca', colname: 'marca', selected: true, default: false },
    {
      id: 6,
      value: 'Cod. Barras',
      colname: 'codBarras',
      selected: false,
      default: false,
    },
    {
      id: 7,
      value: 'Unidades',
      colname: 'unidades',
      selected: true,
      default: true,
    },
    {
      id: 8,
      value: 'Stock actual',
      colname: 'stock',
      selected: false,
      default: false,
    },
    {
      id: 9,
      value: 'Stock final',
      colname: 'stockFinal',
      selected: false,
      default: false,
    },
    {
      id: 10,
      value: 'Precio albarán',
      colname: 'palb',
      selected: true,
      default: true,
    },
    {
      id: 11,
      value: 'Descuento',
      colname: 'descuento',
      selected: false,
      default: false,
    },
    {
      id: 12,
      value: 'Subtotal',
      colname: 'subtotal',
      selected: true,
      default: true,
    },
    { id: 13, value: 'IVA', colname: 'iva', selected: false, default: false },
    {
      id: 14,
      value: 'PUC',
      colname: 'puc',
      selected: true,
      default: true,
    },
    {
      id: 15,
      value: 'Total',
      colname: 'total',
      selected: true,
      default: true,
    },
    {
      id: 16,
      value: 'PVP',
      colname: 'pvp',
      selected: true,
      default: true,
    },
    {
      id: 17,
      value: 'Margen',
      colname: 'margen',
      selected: true,
      default: true,
    },
    {
      id: 18,
      value: 'Borrar',
      colname: 'borrar',
      selected: true,
      default: true,
    },
  ];
  colOptionsSelected: number[] = [];

  pedidoDisplayedColumns: string[] = [];
  pedidoDataSource: MatTableDataSource<PedidoLinea> =
    new MatTableDataSource<PedidoLinea>();

  nuevoLocalizador: number = null;
  @ViewChild('localizadorBox', { static: true }) localizadorBox: ElementRef;

  pdfsUrl: string = environment.pdfsUrl;

  autoSave: boolean = false;
  autoSaveIntervalId: number = null;
  autoSaveIntervalTime: number = 30000;
  autoSaveManually: boolean = false;

  selectedPdf: SafeUrl = null;

  showBuscador: boolean = false;

  ngOnInit(): void {
    this.dontSave = false;
    this.ivaOptions = this.config.ivaOptions;
    for (const ivaOption of this.ivaOptions) {
      this.ivaList.push(ivaOption.iva);
      this.reList.push(ivaOption.re);
    }
    this.changeOptions();
    this.activatedRoute.params.subscribe((params: Params): void => {
      if (params.id) {
        if (parseInt(params.id) !== 0) {
          this.loadPedido(params.id);
        } else {
          this.loadPedidoTemporal();
        }
      } else {
        this.newPedido();
      }
    });
  }

  loadPedido(id: number): void {
    this.cs.getPedido(id).subscribe((result: PedidoResult): void => {
      this.pedido = new Pedido().fromInterface(result.pedido);
      this.cs.pedidoCargado = this.pedido.id;

      for (const iva of this.ivaOptions) {
        iva.tipoIVA = this.pedido.re ? 're' : 'iva';
      }
      this.pedido.ivaOptions = this.ivaOptions;

      this.colOptionsSelected = [];
      for (const pv of this.pedido.vista) {
        if (pv.status) {
          this.colOptionsSelected.push(pv.idColumn);
        }
      }
      if (this.pedido.recepcionado) {
        const borrarId: number = 18;
        const borrarInd: number = this.colOptions.findIndex(
          (x: PedidosColOption): boolean => x.id === borrarId
        );
        this.colOptions.splice(borrarInd, 1);
      }
      this.changeOptions();

      this.titulo = 'Pedido ' + this.pedido.id;
      this.fechaPago = getDateFromString(this.pedido.fechaPago);
      this.fechaPedido = getDateFromString(this.pedido.fechaPedido);
      this.pedidoDataSource.data = this.pedido.lineas;
      this.checkReturnInfo();
    });
  }

  loadPedidoTemporal(): void {
    this.pedido = this.cs.pedidoTemporal;
    if (this.pedido.fechaPago !== null) {
      this.fechaPago = getDateFromString(this.pedido.fechaPago);
    }
    if (this.pedido.fechaPedido !== null) {
      this.fechaPedido = getDateFromString(this.pedido.fechaPedido);
    }
    for (const pv of this.pedido.vista) {
      if (pv.status) {
        this.colOptionsSelected.push(pv.idColumn);
      }
    }
    this.changeOptions();
    this.pedidoDataSource.data = this.pedido.lineas;
    this.checkReturnInfo();
  }

  newPedido(): void {
    this.pedido.ivaOptions = this.ivaOptions;
    this.checkReturnInfo();
    if (this.config.tipoIva === 're') {
      this.pedido.re = true;
    }
    this.localizadorBox.nativeElement.focus();
  }

  checkReturnInfo(): void {
    if (this.ars.returnInfo !== null && this.ars.returnInfo.extra !== null) {
      this.nuevoLocalizador = this.ars.returnInfo.extra;
      const loc: HTMLInputElement = document.getElementById(
        'nuevo-localizador'
      ) as HTMLInputElement;
      const ev: KeyboardEvent = new KeyboardEvent('keydown', {
        code: 'Enter',
        key: 'Enter',
        keyCode: 13,
        which: 13,
      });
      loc.dispatchEvent(ev);
    }
  }

  back(): void {
    if (this.pedido.id === null) {
      this.dialog
        .confirm({
          title: 'Confirmar',
          content:
            '¿Estás seguro de querer salir? Este pedido no ha sido guardado todavía.',
        })
        .subscribe((result: boolean): void => {
          if (result === true) {
            this.dontSave = true;
            this.cs.pedidoCargado = null;
            this.cs.pedidoTemporal = null;
            this.router.navigate(['/compras']);
          }
        });
    } else {
      this.cs.pedidoCargado = null;
      this.cs.pedidoTemporal = null;
      this.router.navigate(['/compras']);
    }
  }

  changeAutoSave(): void {
    this.autoSaveManually = true;
    if (this.autoSave) {
      this.autoSaveIntervalId = window.setInterval((): void => {
        this.startAutoSave();
      }, this.autoSaveIntervalTime);
    } else {
      clearInterval(this.autoSaveIntervalId);
    }
  }

  openProveedor(): void {
    const modalnewProveedorData: Modal = {
      modalTitle: 'Nuevo proveedor',
      modalColor: 'blue',
    };
    const dialog = this.overlayService.open(
      NewProveedorModalComponent,
      modalnewProveedorData
    );
    dialog.afterClosed$.subscribe((data): void => {
      if (data !== null) {
        this.pedido.idProveedor = data.data;
      }
    });
  }

  changeOptions(): void {
    const list: string[] = [];
    for (const opt of this.colOptions) {
      if (opt.default || this.colOptionsSelected.includes(opt.id)) {
        list.push(opt.colname);
      }
    }
    this.pedidoDisplayedColumns = list;
  }

  tosslePerOne(): void {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return;
    }
    let selectedNum: number = 0;
    let totalNum: number = 0;
    for (const i in this.colOptions) {
      if (!this.colOptions[i].default) {
        totalNum++;
        if (this.colOptionsSelected.includes(this.colOptions[i].id)) {
          selectedNum++;
        }
      }
    }
    if (selectedNum == totalNum) {
      this.allSelected.select();
    }
    this.changeOptions();
  }

  toggleAllSelection(): void {
    if (this.allSelected.selected) {
      this.allSelected.select();
      this.colOptionsSelected = [0];
      for (const i in this.colOptions) {
        if (!this.colOptions[i].default) {
          this.colOptionsSelected.push(this.colOptions[i].id);
        }
      }
    } else {
      this.allSelected.deselect();
      this.colOptionsSelected = [];
    }
    this.changeOptions();
  }

  ordenarLinea(localizador: number, sent: string): void {
    const ind: number = this.pedido.lineas.findIndex(
      (x: PedidoLinea): boolean => {
        return x.localizador === localizador;
      }
    );
    let nextInd: number = null;
    if (sent === 'up') {
      if (ind === 0) {
        return;
      }
      nextInd = ind - 1;
    }
    if (sent === 'down') {
      if (ind === this.pedido.lineas.length - 1) {
        return;
      }
      nextInd = ind + 1;
    }
    const aux: PedidoLinea = this.pedido.lineas[ind];
    this.pedido.lineas[ind] = this.pedido.lineas[nextInd];
    this.pedido.lineas[nextInd] = aux;
    this.pedidoDataSource.data = this.pedido.lineas;
  }

  updateTipoIva(): void {
    for (const linea of this.pedido.lineas) {
      const ind: number = this.ivaList.findIndex(
        (x: number): boolean => x == linea.iva
      );
      linea.re = this.pedido.re ? this.reList[ind] : 0;
    }
  }

  updatePalb(linea: PedidoLinea): void {
    linea.puc = getTwoNumberDecimal(
      linea.palb *
        (1 - linea.descuento / 100) *
        (1 + (linea.iva + linea.re) / 100)
    );
    this.updateMargen(linea);
  }

  updateIva(option: string, linea: PedidoLinea): void {
    const ind: number = this.ivaList.findIndex(
      (x: number): boolean => x == parseInt(option)
    );
    linea.re = this.pedido.re ? this.reList[ind] : 0;
    this.updatePalb(linea);
  }

  updateRe(option: string, linea: PedidoLinea): void {
    const ind: number = this.reList.findIndex(
      (x: number): boolean => x == parseFloat(option)
    );
    linea.iva = this.ivaList[ind];
    this.updatePalb(linea);
  }

  updateMargen(linea: PedidoLinea): void {
    linea.margen = getTwoNumberDecimal(
      (100 * (linea.pvp - linea.puc)) / linea.pvp
    );
  }

  checkLocalizador(ev: KeyboardEvent): void {
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
      };
      const dialog = this.overlayService.open(
        BuscadorModalComponent,
        modalBuscadorData
      );
      dialog.afterClosed$.subscribe((data): void => {
        this.showBuscador = false;
        if (data.data !== null) {
          this.nuevoLocalizador = data.data;
          this.loadArticulo();
        } else {
          this.localizadorBox.nativeElement.focus();
        }
      });

      return;
    }
    if (ev.key == 'Enter') {
      ev.preventDefault();
      ev.stopPropagation();

      this.loadArticulo();
    }
  }

  loadArticulo(): void {
    this.ars
      .loadArticulo(this.nuevoLocalizador)
      .subscribe((result: ArticuloResult): void => {
        if (result.status === 'ok') {
          const articulo: Articulo = this.cms.getArticulo(result.articulo);

          const ind: number = this.pedido.lineas.findIndex(
            (x: PedidoLinea): boolean => {
              return x.localizador === articulo.localizador;
            }
          );

          if (ind === -1) {
            const lineaPedido: PedidoLinea = new PedidoLinea().fromArticulo(
              articulo
            );
            if (
              this.ars.returnInfo !== null &&
              this.ars.returnInfo.extra !== null &&
              this.ars.returnInfo.extra === articulo.localizador
            ) {
              this.ars.returnInfo = null;
              lineaPedido.unidades = articulo.stock;
              lineaPedido.nombreArticulo = articulo.nombre;
            }
            lineaPedido.iva = articulo.iva;
            lineaPedido.re = this.pedido.re ? articulo.re : 0;
            const marca: Marca = this.ms.findById(lineaPedido.idMarca);
            lineaPedido.marca = marca.nombre;

            this.pedido.lineas.push(lineaPedido);
            this.pedidoDataSource.data = this.pedido.lineas;
          } else {
            this.pedido.lineas[ind].unidades++;
          }

          this.nuevoLocalizador = null;
          /*if (!this.autoSaveManually) {
          this.autoSave = true;
          this.changeAutoSave();
          this.autoSaveManually = false;
        }*/
          this.localizadorBox.nativeElement.focus();
        } else {
          this.dialog
            .alert({
              title: 'Error',
              content: 'No se encuentra el localizador indicado.',
            })
            .subscribe((): void => {
              this.localizadorBox.nativeElement.focus();
            });
        }
      });
  }

  checkArrows(ev: KeyboardEvent): void {
    if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
      ev.preventDefault();
      const target: string[] = (<HTMLInputElement>ev.target).id.split('-');
      const localizador: number = parseInt(target[2]);
      const ind: number = this.pedido.lineas.findIndex(
        (x: PedidoLinea): boolean => {
          return x.localizador === localizador;
        }
      );
      let previousInd: number = ind - 1;
      let nextInd: number = ind + 1;
      let newLocalizador: number = null;
      if (ev.key === 'ArrowUp' && previousInd !== -1) {
        if (target[1] === 'codBarras') {
          while (newLocalizador === null && previousInd > 0) {
            if (this.pedido.lineas[previousInd].showCodigoBarras) {
              newLocalizador = this.pedido.lineas[previousInd].localizador;
            } else {
              previousInd--;
            }
          }
        } else {
          newLocalizador = this.pedido.lineas[previousInd].localizador;
        }
      }
      if (ev.key === 'ArrowDown' && nextInd < this.pedido.lineas.length) {
        if (target[1] === 'codBarras') {
          while (
            newLocalizador === null &&
            nextInd < this.pedido.lineas.length
          ) {
            if (this.pedido.lineas[nextInd].showCodigoBarras) {
              newLocalizador = this.pedido.lineas[nextInd].localizador;
            } else {
              nextInd++;
            }
          }
        } else {
          newLocalizador = this.pedido.lineas[nextInd].localizador;
        }
      }
      if (newLocalizador !== null) {
        document
          .getElementById(target[0] + '-' + target[1] + '-' + newLocalizador)
          .focus();
      }
    }
  }

  checkNull(element: PedidoLinea = null): void {
    if (element !== null) {
      if (element.unidades === null) {
        element.unidades = 1;
      }
      if (element.palb === null) {
        element.palb = 0;
      }
      if (element.descuento === null) {
        element.descuento = 0;
      }
      if (element.pvp === null) {
        element.pvp = 0;
      }
    }
    if (this.pedido.portes === null) {
      this.pedido.portes = 0;
    }
    if (this.pedido.descuento === null) {
      this.pedido.descuento = 0;
    }
  }

  borrarLinea(localizador: number): void {
    const ind: number = this.pedido.lineas.findIndex(
      (x: PedidoLinea): boolean => {
        return x.localizador === localizador;
      }
    );
    if (ind !== -1) {
      this.dialog
        .confirm({
          title: 'Confirmar',
          content:
            '¿Estás seguro de querer borrar la línea con localizador "' +
            localizador +
            '"?',
        })
        .subscribe((result: boolean): void => {
          if (result === true) {
            this.pedido.lineas.splice(ind, 1);
            this.pedidoDataSource.data = this.pedido.lineas;
          }
          this.localizadorBox.nativeElement.focus();
        });
    }
  }

  goToArticulo(localizador: number, ev: MouseEvent = null): void {
    ev && ev.preventDefault();
    this.ars.returnInfo = {
      where: localizador === 0 ? 'pedido' : 'pedido-edit',
      id: this.pedido.id === null ? 0 : this.pedido.id,
      extra: null,
    };
    this.ars.newArticulo(localizador);
    this.router.navigate(['/articulos']);
  }

  addPDF(): void {
    document.getElementById('pdf-file').click();
  }

  onPDFChange(ev: Event): void {
    const reader: FileReader = new FileReader();
    if (
      (<HTMLInputElement>ev.target).files &&
      (<HTMLInputElement>ev.target).files.length > 0
    ) {
      const file = (<HTMLInputElement>ev.target).files[0];
      reader.readAsDataURL(file);
      reader.onload = (): void => {
        const pdf: PedidoPDF = new PedidoPDF(
          null,
          reader.result as string,
          file.name
        );
        this.pedido.pdfs.push(pdf);
        (<HTMLInputElement>document.getElementById('pdf-file')).value = '';
      };
    }
  }

  previewPdf(pdf: PedidoPDF): void {
    this.selectedPdf = this.sanitizer.bypassSecurityTrustResourceUrl(pdf.data);
  }

  closePreview(ev: MouseEvent): void {
    ev && ev.preventDefault();
    this.selectedPdf = null;
  }

  deletePDF(ind: number, pdf: PedidoPDF): void {
    this.dialog
      .confirm({
        title: 'Confirmar',
        content:
          '¿Estás seguro de querer borrar el archivo "' + pdf.nombre + '"?',
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          if (!this.pedido.pdfs[ind].id) {
            this.pedido.pdfs.splice(ind, 1);
          } else {
            this.pedido.pdfs[ind].deleted = true;
          }
        }
        this.localizadorBox.nativeElement.focus();
      });
  }

  updatePedidoData(): void {
    this.pedido.fechaPago = getDate(this.fechaPago);
    this.pedido.fechaPedido = getDate(this.fechaPedido);
    this.pedido.importe = this.pedido.total;
    this.pedido.vista = [];
    for (const opt of this.colOptions) {
      this.pedido.vista.push(
        new PedidoVista(
          opt.id,
          opt.default || this.colOptionsSelected.includes(opt.id)
        )
      );
    }
  }

  validarPedido(): boolean {
    this.updatePedidoData();

    if (this.pedido.idProveedor === -1) {
      this.dialog
        .alert({
          title: 'Error',
          content: 'No has indicado ningún proveedor.',
        })
        .subscribe((): void => {
          this.proveedoresValue.toggle();
        });
      return false;
    }

    if (this.pedido.tipo === null) {
      this.dialog
        .alert({
          title: 'Error',
          content:
            'No has indicado número de ' +
            (this.pedido.tipo === 'albaran' ? 'albarán' : this.pedido.tipo) +
            '.',
        })
        .subscribe((): void => {
          this.numAlbaranFacturaBox.nativeElement.focus();
        });
      return false;
    }

    if (this.pedido.lineas.length === 0) {
      this.dialog
        .alert({
          title: 'Error',
          content: 'No has añadido ningún artículo al pedido.',
        })
        .subscribe((): void => {
          this.localizadorBox.nativeElement.focus();
        });
      return false;
    }

    return true;
  }

  guardar(): void {
    if (this.validarPedido()) {
      this.guardarPedido();
    }
  }

  recepcionar(): void {
    this.dialog
      .confirm({
        title: 'Recepcionar',
        content:
          '¿Estás seguro de querer recepcionar este pedido? Una vez lo hagas los datos se guardarán de manera definitiva, se modificaran stocks, precios...',
        ok: 'Recepcionar',
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          if (this.validarPedido()) {
            this.pedido.recepcionado = true;
            this.guardarPedido();
          }
        }
      });
  }

  guardarPedido(): void {
    this.cs
      .savePedido(this.pedido.toInterface())
      .subscribe((result: PedidoSaveResult): void => {
        if (result.status === 'ok') {
          this.pedido.id = result.id;
          this.titulo = 'Pedido ' + this.pedido.id;
          this.dialog
            .alert({
              title: 'OK',
              content: 'El pedido ha sido correctamente guardado.',
            })
            .subscribe((): void => {
              this.dontSave = true;
              this.back();
            });
        } else {
          this.dialog.alert({
            title: 'Error',
            content:
              'Los siguientes códigos de barras ya están siendo usados: ' +
              urldecode(result.message),
          });
        }
      });
  }

  startAutoSave(): void {
    this.updatePedidoData();
    this.cs
      .autoSavePedido(this.pedido.toInterface())
      .subscribe((result: PedidoSaveResult): void => {
        this.pedido.id = result.id;
        this.titulo = 'Pedido ' + this.pedido.id;
      });
  }

  deletePedido(): void {
    this.dialog
      .confirm({
        title: 'Confirmar',
        content: '¿Estás seguro de querer eliminar este pedido?',
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.cs
            .deletePedido(this.pedido.id)
            .subscribe((result: StatusResult): void => {
              if (result.status === 'ok') {
                this.dialog
                  .alert({
                    title: 'Pedido borrado',
                    content:
                      'El pedido y todos sus datos han sido correctamente eliminados.',
                  })
                  .subscribe((): void => {
                    this.dontSave = true;
                    this.back();
                  });
              } else {
                this.dialog.alert({
                  title: 'Error',
                  content: 'Ocurrió un error al borrar el pedido.',
                });
              }
            });
        }
      });
  }

  ngOnDestroy(): void {
    clearInterval(this.autoSaveIntervalId);
    if (!this.dontSave) {
      this.updatePedidoData();
      if (this.pedido.id === null) {
        this.cs.setPedidoTemporal(this.pedido);
      } else {
        this.cs
          .autoSavePedido(this.pedido.toInterface())
          .subscribe((result: PedidoSaveResult): void => {
            if (result.status === 'error') {
              this.dialog.alert({
                title: 'Error',
                content:
                  'Ocurrió un error al guardar automáticamente el pedido.',
              });
            }
          });
      }
    }
  }
}
