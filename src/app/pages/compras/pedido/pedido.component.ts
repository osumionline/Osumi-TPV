import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatSelect } from "@angular/material/select";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { NewProveedorComponent } from "src/app/components/new-proveedor/new-proveedor.component";
import { PedidosColOption } from "src/app/interfaces/pedido.interface";
import { Articulo } from "src/app/model/articulo.model";
import { IVAOption } from "src/app/model/iva-option.model";
import { Marca } from "src/app/model/marca.model";
import { PedidoLinea } from "src/app/model/pedido-linea.model";
import { PedidoPDF } from "src/app/model/pedido-pdf.model";
import { Pedido } from "src/app/model/pedido.model";
import { ArticulosService } from "src/app/services/articulos.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ComprasService } from "src/app/services/compras.service";
import { ConfigService } from "src/app/services/config.service";
import { DialogService } from "src/app/services/dialog.service";
import { MarcasService } from "src/app/services/marcas.service";
import { ProveedoresService } from "src/app/services/proveedores.service";
import { Utils } from "src/app/shared/utils.class";

@Component({
  selector: "otpv-pedido",
  templateUrl: "./pedido.component.html",
  styleUrls: ["./pedido.component.scss"],
})
export class PedidoComponent implements OnInit, AfterViewInit {
  titulo: string = "Nuevo pedido";
  pedido: Pedido = new Pedido();
  @ViewChild("newProveedor", { static: true })
  newProveedor: NewProveedorComponent;
  @ViewChild("proveedoresValue", { static: true }) proveedoresValue: MatSelect;
  fechaPedido: Date = new Date();
  fechaPago: Date = new Date();
  @ViewChild("numAlbaranFacturaBox", { static: true })
  numAlbaranFacturaBox: ElementRef;
  colOptions: PedidosColOption[] = [
    {
      id: 1,
      value: "Localizador",
      colname: "localizador",
      selected: true,
      default: true,
    },
    {
      id: 2,
      value: "Descripción",
      colname: "descripcion",
      selected: true,
      default: true,
    },
    { id: 3, value: "Marca", colname: "marca", selected: true, default: false },
    {
      id: 4,
      value: "Referencia",
      colname: "referencia",
      selected: false,
      default: false,
    },
    {
      id: 5,
      value: "Cod. Barras",
      colname: "codBarras",
      selected: false,
      default: false,
    },
    {
      id: 6,
      value: "Stock actual",
      colname: "stock",
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
      value: "Precio albarán",
      colname: "palb",
      selected: true,
      default: true,
    },
    {
      id: 9,
      value: "Subtotal",
      colname: "subtotal",
      selected: true,
      default: true,
    },
    { id: 10, value: "IVA", colname: "iva", selected: false, default: false },
    {
      id: 11,
      value: "Descuento",
      colname: "descuento",
      selected: false,
      default: false,
    },
    {
      id: 12,
      value: "PUC",
      colname: "puc",
      selected: true,
      default: true,
    },
    {
      id: 13,
      value: "Total",
      colname: "total",
      selected: true,
      default: true,
    },
    {
      id: 14,
      value: "PVP",
      colname: "pvp",
      selected: true,
      default: true,
    },
    {
      id: 15,
      value: "Margen",
      colname: "margen",
      selected: true,
      default: true,
    },
    {
      id: 16,
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
  @ViewChild(MatSort) sort: MatSort;

  nuevoLocalizador: number = null;
  @ViewChild("localizadorBox", { static: true }) localizadorBox: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    public config: ConfigService,
    public ps: ProveedoresService,
    private ars: ArticulosService,
    private cms: ClassMapperService,
    private dialog: DialogService,
    private ms: MarcasService,
    private cs: ComprasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.changeOptions();
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.id) {
        this.cs.getPedido(params.id).subscribe((result) => {
          this.pedido = new Pedido().fromInterface(result.pedido);
          this.pedido.ivaOptions = this.config.ivaOptions;

          if (this.pedido.recepcionado) {
            const borrarInd: number = this.colOptions.findIndex(
              (x: PedidosColOption): boolean => x.id === 16
            );
            this.colOptions.splice(borrarInd, 1);
            this.changeOptions();
          }

          this.titulo = "Pedido " + this.pedido.id;
          this.fechaPago = Utils.getDateFromString(this.pedido.fechaPago);
          this.fechaPedido = Utils.getDateFromString(this.pedido.fechaPedido);
          this.pedidoDataSource.data = this.pedido.lineas;
          this.localizadorBox.nativeElement.focus();
        });
      } else {
        this.pedido.ivaOptions = this.config.ivaOptions;
        this.localizadorBox.nativeElement.focus();
      }
    });
  }

  ngAfterViewInit(): void {
    this.pedidoDataSource.sort = this.sort;
  }

  openProveedor(): void {
    this.newProveedor.newProveedor();
  }

  proveedorGuardado(id: number): void {
    this.pedido.idProveedor = id;
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

  updateIvaRe(ivaOption: string, linea: PedidoLinea): void {
    const ivaInd: number = this.config.ivaOptions.findIndex(
      (x: IVAOption): boolean => x.id == ivaOption
    );
    linea.selectedIvaOption.updateValues(
      this.config.ivaOptions[ivaInd].iva,
      this.config.ivaOptions[ivaInd].re
    );
    linea.iva = linea.selectedIvaOption.iva;
    linea.re = linea.selectedIvaOption.re;
  }

  checkLocalizador(ev: KeyboardEvent): void {
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
          let ivaOption: IVAOption = new IVAOption("iva", 21);
          if (this.config.tipoIva === "re") {
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
      const previousInd: number = ind - 1;
      const nextInd: number = ind + 1;
      let newLocalizador: number = null;
      if (ev.key === "ArrowUp" && previousInd !== -1) {
        newLocalizador = this.pedido.lineas[previousInd].localizador;
      }
      if (ev.key === "ArrowDown" && nextInd < this.pedido.lineas.length) {
        newLocalizador = this.pedido.lineas[nextInd].localizador;
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
          this.pedido.pdfs.splice(ind, 1);
        }
        this.localizadorBox.nativeElement.focus();
      });
  }

  validarPedido(): boolean {
    this.pedido.fechaPago = Utils.getDate(this.fechaPago);
    this.pedido.fechaPedido = Utils.getDate(this.fechaPedido);
    this.pedido.importe = this.pedido.total;

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

    if (this.pedido.numAlbaranFactura === null) {
      this.dialog
        .alert({
          title: "Error",
          content:
            "No has indicado número de " +
            (this.pedido.albaranFactura === "albaran" ? "albarán" : "factura") +
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
        this.cs.resetPedidos();
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
            content: "Ha ocurrido un error al guardar el pedido.",
            ok: "Continuar",
          })
          .subscribe((result) => {});
      }
    });
  }
}
