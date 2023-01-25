import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatSelect } from "@angular/material/select";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { BuscadorModalComponent } from "src/app/components/modals/buscador-modal/buscador-modal.component";
import { NewProveedorModalComponent } from "src/app/components/modals/new-proveedor-modal/new-proveedor-modal.component";
import { BuscadorModal, Modal } from "src/app/interfaces/modals.interface";
import { PedidosColOption } from "src/app/interfaces/pedido.interface";
import { Articulo } from "src/app/model/articulo.model";
import { IVAOption } from "src/app/model/iva-option.model";
import { Marca } from "src/app/model/marca.model";
import { PedidoLinea } from "src/app/model/pedido-linea.model";
import { PedidoPDF } from "src/app/model/pedido-pdf.model";
import { PedidoVista } from "src/app/model/pedido-vista.model";
import { Pedido } from "src/app/model/pedido.model";
import { ArticulosService } from "src/app/services/articulos.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ComprasService } from "src/app/services/compras.service";
import { ConfigService } from "src/app/services/config.service";
import { DialogService } from "src/app/services/dialog.service";
import { MarcasService } from "src/app/services/marcas.service";
import { OverlayService } from "src/app/services/overlay.service";
import { ProveedoresService } from "src/app/services/proveedores.service";
import { Utils } from "src/app/shared/utils.class";
import { environment } from "src/environments/environment";

@Component({
  selector: "otpv-pedido",
  templateUrl: "./pedido.component.html",
  styleUrls: ["./pedido.component.scss"],
})
export class PedidoComponent implements OnInit, OnDestroy {
  titulo: string = "Nuevo pedido";
  pedido: Pedido = new Pedido();
  @ViewChild("proveedoresValue", { static: true }) proveedoresValue: MatSelect;
  fechaPedido: Date = new Date();
  fechaPago: Date = new Date();
  @ViewChild("numAlbaranFacturaBox", { static: true })
  numAlbaranFacturaBox: ElementRef;

  ivaOptions: IVAOption[] = [];

  metodosPago: string[] = [
    "Domiciliación bancaria",
    "Tarjeta",
    "Paypal",
    "Al contado",
  ];

  colOptions: PedidosColOption[] = [
    {
      id: 1,
      value: "Ordenar",
      colname: "ordenar",
      selected: true,
      default: false,
    },
    {
      id: 2,
      value: "Localizador",
      colname: "localizador",
      selected: true,
      default: true,
    },
    {
      id: 3,
      value: "Descripción",
      colname: "nombreArticulo",
      selected: true,
      default: true,
    },
    {
      id: 4,
      value: "Referencia",
      colname: "referencia",
      selected: false,
      default: false,
    },
    { id: 5, value: "Marca", colname: "marca", selected: true, default: false },
    {
      id: 6,
      value: "Cod. Barras",
      colname: "codBarras",
      selected: false,
      default: false,
    },
    {
      id: 7,
      value: "Unidades",
      colname: "unidades",
      selected: true,
      default: true,
    },
    {
      id: 8,
      value: "Stock actual",
      colname: "stock",
      selected: false,
      default: false,
    },
    {
      id: 9,
      value: "Stock final",
      colname: "stockFinal",
      selected: false,
      default: false,
    },
    {
      id: 10,
      value: "Precio albarán",
      colname: "palb",
      selected: true,
      default: true,
    },
    {
      id: 11,
      value: "Descuento",
      colname: "descuento",
      selected: false,
      default: false,
    },
    {
      id: 12,
      value: "Subtotal",
      colname: "subtotal",
      selected: true,
      default: true,
    },
    { id: 13, value: "IVA", colname: "iva", selected: false, default: false },
    {
      id: 14,
      value: "PUC",
      colname: "puc",
      selected: true,
      default: true,
    },
    {
      id: 15,
      value: "Total",
      colname: "total",
      selected: true,
      default: true,
    },
    {
      id: 16,
      value: "PVP",
      colname: "pvp",
      selected: true,
      default: true,
    },
    {
      id: 17,
      value: "Margen",
      colname: "margen",
      selected: true,
      default: true,
    },
    {
      id: 18,
      value: "Borrar",
      colname: "borrar",
      selected: true,
      default: true,
    },
  ];
  colOptionsSelected: number[] = [];

  pedidoDisplayedColumns: string[] = [];
  pedidoDataSource: MatTableDataSource<PedidoLinea> =
    new MatTableDataSource<PedidoLinea>();

  nuevoLocalizador: number = null;
  @ViewChild("localizadorBox", { static: true }) localizadorBox: ElementRef;

  pdfsUrl: string = environment.pdfsUrl;

  autoSave: boolean = false;
  autoSaveIntervalId: number = null;
  autoSaveIntervalTime: number = 30000;
  autoSaveManually: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    public config: ConfigService,
    public ps: ProveedoresService,
    private ars: ArticulosService,
    private cms: ClassMapperService,
    private dialog: DialogService,
    private ms: MarcasService,
    private cs: ComprasService,
    private router: Router,
    private overlayService: OverlayService
  ) {}

  ngOnInit(): void {
    this.ivaOptions = this.config.ivaOptions;
    for (let ivaOption of this.ivaOptions) {
      ivaOption.tipoIVA = "iva";
    }
    this.changeOptions();
    this.activatedRoute.params.subscribe((params: Params) => {
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
    this.cs.getPedido(id).subscribe((result) => {
      this.pedido = new Pedido().fromInterface(result.pedido);
      this.cs.pedidoCargado = this.pedido.id;

      for (let iva of this.ivaOptions) {
        iva.tipoIVA = this.pedido.re ? "re" : "iva";
      }
      this.pedido.ivaOptions = this.ivaOptions;

      this.colOptionsSelected = [];
      for (let pv of this.pedido.vista) {
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

      for (let linea of this.pedido.lineas) {
        let ivaOption: IVAOption = this.config.findIVAOptionByIVA(linea.iva);
        if (this.pedido.re) {
          ivaOption = new IVAOption("re", linea.iva, linea.re);
        }
        linea.selectedIvaOption = ivaOption;
      }

      this.titulo = "Pedido " + this.pedido.id;
      this.fechaPago = Utils.getDateFromString(this.pedido.fechaPago);
      this.fechaPedido = Utils.getDateFromString(this.pedido.fechaPedido);
      this.pedidoDataSource.data = this.pedido.lineas;
    });
  }

  loadPedidoTemporal(): void {
    this.pedido = this.cs.pedidoTemporal;
    if (this.pedido.fechaPago !== null) {
      this.fechaPago = Utils.getDateFromString(this.pedido.fechaPago);
    }
    if (this.pedido.fechaPedido !== null) {
      this.fechaPedido = Utils.getDateFromString(this.pedido.fechaPedido);
    }
    for (let pv of this.pedido.vista) {
      if (pv.status) {
        this.colOptionsSelected.push(pv.idColumn);
      }
    }
    this.changeOptions();
    this.pedidoDataSource.data = this.pedido.lineas;
  }

  newPedido(): void {
    this.pedido.ivaOptions = this.ivaOptions;
    this.localizadorBox.nativeElement.focus();
  }

  back() {
    this.cs.pedidoCargado = null;
    this.router.navigate(["/compras"]);
  }

  changeAutoSave(): void {
    this.autoSaveManually = true;
    if (this.autoSave) {
      this.autoSaveIntervalId = window.setInterval(() => {
        this.startAutoSave();
      }, this.autoSaveIntervalTime);
    } else {
      clearInterval(this.autoSaveIntervalId);
    }
  }

  openProveedor(): void {
    const modalnewProveedorData: Modal = {
      modalTitle: "Nuevo proveedor",
      modalColor: "blue",
    };
    const dialog = this.overlayService.open(
      NewProveedorModalComponent,
      modalnewProveedorData
    );
    dialog.afterClosed$.subscribe((data) => {
      if (data !== null) {
        this.pedido.idProveedor = data.data;
      }
    });
  }

  changeOptions(): void {
    const list: string[] = [];
    for (let opt of this.colOptions) {
      if (opt.default || this.colOptionsSelected.includes(opt.id)) {
        list.push(opt.colname);
      }
    }
    this.pedidoDisplayedColumns = list;
  }

  updateTipoIva(): void {
    for (let ivaOption of this.ivaOptions) {
      ivaOption.tipoIVA = this.pedido.re ? "re" : "iva";
    }
    this.pedido.ivaOptions = this.ivaOptions;
    for (let linea of this.pedido.lineas) {
      linea.selectedIvaOption.tipoIVA = this.pedido.re ? "re" : "iva";

      const ivaOption: IVAOption = this.config.findIVAOptionByIVA(
        linea.selectedIvaOption.iva
      );
      linea.selectedIvaOption.updateValues(ivaOption.iva, ivaOption.re);
      linea.iva = linea.selectedIvaOption.iva;
      linea.re = this.pedido.re ? linea.selectedIvaOption.re : 0;
    }
  }

  ordenarLinea(localizador: number, sent: string): void {
    const ind: number = this.pedido.lineas.findIndex(
      (x: PedidoLinea): boolean => {
        return x.localizador === localizador;
      }
    );
    let nextInd: number = null;
    if (sent === "up") {
      if (ind === 0) {
        return;
      }
      nextInd = ind - 1;
    }
    if (sent === "down") {
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

  updateIvaRe(option: string, linea: PedidoLinea): void {
    for (let iva of this.ivaOptions) {
      iva.tipoIVA = this.pedido.re ? "re" : "iva";
    }
    this.pedido.ivaOptions = this.ivaOptions;

    const ivaOption: IVAOption = this.config.findIVAOptionById(option);

    linea.selectedIvaOption.updateValues(ivaOption.iva, ivaOption.re);
    linea.iva = linea.selectedIvaOption.iva;
    linea.re = this.pedido.re ? linea.selectedIvaOption.re : 0;
  }

  checkLocalizador(ev: KeyboardEvent): void {
    const letters = /^[a-zA-Z]{1}$/;
    if (ev.key.match(letters)) {
      ev.preventDefault();

      const modalBuscadorData: BuscadorModal = {
        modalTitle: "Buscador",
        modalColor: "blue",
        css: "modal-wide",
        key: ev.key,
      };
      const dialog = this.overlayService.open(
        BuscadorModalComponent,
        modalBuscadorData
      );
      dialog.afterClosed$.subscribe((data) => {
        if (data !== null) {
          this.nuevoLocalizador = data.data;
          this.loadArticulo();
        } else {
          this.localizadorBox.nativeElement.focus();
        }
      });

      return;
    }
    if (ev.key == "Enter") {
      ev.preventDefault();
      ev.stopPropagation();

      this.loadArticulo();
    }
  }

  loadArticulo(): void {
    this.ars.loadArticulo(this.nuevoLocalizador).subscribe((result) => {
      if (result.status === "ok") {
        const articulo: Articulo = this.cms.getArticulo(result.articulo);

        const ind: number = this.pedido.lineas.findIndex((x: PedidoLinea) => {
          return x.localizador === articulo.localizador;
        });

        if (ind === -1) {
          const lineaPedido: PedidoLinea = new PedidoLinea().fromArticulo(
            articulo
          );
          let ivaOption: IVAOption = new IVAOption("iva", 21, 5.2);
          if (this.pedido.re) {
            ivaOption = new IVAOption("re", 21, 5.2);
          }
          lineaPedido.selectedIvaOption = ivaOption;

          const marca: Marca = this.ms.findById(lineaPedido.idMarca);
          lineaPedido.marca = marca.nombre;

          this.pedido.lineas.push(lineaPedido);
          this.pedidoDataSource.data = this.pedido.lineas;
        } else {
          this.pedido.lineas[ind].unidades++;
        }

        this.nuevoLocalizador = null;
        if (!this.autoSaveManually) {
          this.autoSave = true;
          this.changeAutoSave();
          this.autoSaveManually = false;
        }
        this.localizadorBox.nativeElement.focus();
      } else {
        this.dialog
          .alert({
            title: "Error",
            content: "No se encuentra el localizador indicado.",
            ok: "Continuar",
          })
          .subscribe((result) => {
            this.localizadorBox.nativeElement.focus();
          });
      }
    });
  }

  checkArrows(ev: KeyboardEvent): void {
    if (ev.key === "ArrowUp" || ev.key === "ArrowDown") {
      ev.preventDefault();
      const target: string[] = (<HTMLInputElement>ev.target).id.split("-");
      const localizador: number = parseInt(target[2]);
      const ind: number = this.pedido.lineas.findIndex(
        (x: PedidoLinea): boolean => {
          return x.localizador === localizador;
        }
      );
      let previousInd: number = ind - 1;
      let nextInd: number = ind + 1;
      let newLocalizador: number = null;
      if (ev.key === "ArrowUp" && previousInd !== -1) {
        if (target[1] === "codBarras") {
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
      if (ev.key === "ArrowDown" && nextInd < this.pedido.lineas.length) {
        if (target[1] === "codBarras") {
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
          .getElementById(target[0] + "-" + target[1] + "-" + newLocalizador)
          .focus();
      }
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
          title: "Confirmar",
          content:
            '¿Estás seguro de querer borrar la línea con localizador "' +
            localizador +
            '"?',
          ok: "Continuar",
          cancel: "Cancelar",
        })
        .subscribe((result) => {
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
    this.updatePedidoData();
    if (this.pedido.id === null) {
      this.cs.setPedidoTemporal(this.pedido);
      this.router.navigate(["/articulos", localizador, "return", "pedido", 0]);
    } else {
      this.cs.autoSavePedido(this.pedido.toInterface()).subscribe((result) => {
        this.router.navigate([
          "/articulos",
          localizador,
          "return",
          "pedido",
          this.pedido.id,
        ]);
      });
    }
  }

  addPDF(): void {
    document.getElementById("pdf-file").click();
  }

  onPDFChange(ev: Event): void {
    const reader: FileReader = new FileReader();
    if (
      (<HTMLInputElement>ev.target).files &&
      (<HTMLInputElement>ev.target).files.length > 0
    ) {
      const file = (<HTMLInputElement>ev.target).files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        const pdf: PedidoPDF = new PedidoPDF(
          null,
          reader.result as string,
          file.name
        );
        this.pedido.pdfs.push(pdf);
        (<HTMLInputElement>document.getElementById("pdf-file")).value = "";
      };
    }
  }

  deletePDF(ind: number, pdf: PedidoPDF): void {
    this.dialog
      .confirm({
        title: "Confirmar",
        content:
          '¿Estás seguro de querer borrar el archivo "' + pdf.nombre + '"?',
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result) => {
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
    this.pedido.fechaPago = Utils.getDate(this.fechaPago);
    this.pedido.fechaPedido = Utils.getDate(this.fechaPedido);
    this.pedido.importe = this.pedido.total;
    this.pedido.vista = [];
    for (let opt of this.colOptions) {
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
          title: "Error",
          content: "No has indicado ningún proveedor.",
          ok: "Continuar",
        })
        .subscribe((result) => {
          this.proveedoresValue.toggle();
        });
      return false;
    }

    if (this.pedido.tipo === null) {
      this.dialog
        .alert({
          title: "Error",
          content:
            "No has indicado número de " +
            (this.pedido.tipo === "albaran" ? "albarán" : this.pedido.tipo) +
            ".",
          ok: "Continuar",
        })
        .subscribe((result) => {
          this.numAlbaranFacturaBox.nativeElement.focus();
        });
      return false;
    }

    if (this.pedido.lineas.length === 0) {
      this.dialog
        .alert({
          title: "Error",
          content: "No has añadido ningún artículo al pedido.",
          ok: "Continuar",
        })
        .subscribe((result) => {
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
        title: "Recepcionar",
        content:
          "¿Estás seguro de querer recepcionar este pedido? Una vez lo hagas los datos se guardarán de manera definitiva, se modificaran stocks, precios...",
        ok: "Recepcionar",
        cancel: "Cancelar",
      })
      .subscribe((result) => {
        if (result === true) {
          if (this.validarPedido()) {
            this.pedido.recepcionado = true;
            this.guardarPedido();
          }
        }
      });
  }

  guardarPedido(): void {
    this.cs.savePedido(this.pedido.toInterface()).subscribe((result) => {
      if (result.status === "ok") {
        this.dialog
          .alert({
            title: "OK",
            content: "El pedido ha sido correctamente guardado.",
            ok: "Continuar",
          })
          .subscribe((result) => {
            this.router.navigate(["/compras"]);
          });
      } else {
        this.dialog
          .alert({
            title: "Error",
            content:
              "Los siguientes códigos de barras ya están siendo usados: " +
              Utils.urldecode(result.message),
            ok: "Continuar",
          })
          .subscribe((result) => {});
      }
    });
  }

  startAutoSave(): void {
    this.updatePedidoData();
    this.cs.autoSavePedido(this.pedido.toInterface()).subscribe((result) => {
      this.pedido.id = result.id;
      this.titulo = "Pedido " + this.pedido.id;
    });
  }

  deletePedido(): void {
    this.dialog
      .confirm({
        title: "Confirmar",
        content: "¿Estás seguro de querer eliminar este pedido?",
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result) => {
        if (result === true) {
          this.cs.deletePedido(this.pedido.id).subscribe((result) => {
            this.dialog
              .alert({
                title: "Pedido borrado",
                content:
                  "El pedido y todos sus datos han sido correctamente eliminados.",
                ok: "Continuar",
              })
              .subscribe((result) => {
                this.router.navigate(["/compras"]);
              });
          });
        }
      });
  }

  ngOnDestroy(): void {
    if (this.autoSaveIntervalId) {
      clearInterval(this.autoSaveIntervalId);
    }
  }
}
