import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { NewProveedorComponent } from "src/app/components/new-proveedor/new-proveedor.component";
import { PedidoPDF, PedidosColOption } from "src/app/interfaces/interfaces";
import { Articulo } from "src/app/model/articulo.model";
import { PedidoLinea } from "src/app/model/pedido-linea.model";
import { Pedido } from "src/app/model/pedido.model";
import { ArticulosService } from "src/app/services/articulos.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { DialogService } from "src/app/services/dialog.service";
import { ProveedoresService } from "src/app/services/proveedores.service";

@Component({
  selector: "otpv-pedido",
  templateUrl: "./pedido.component.html",
  styleUrls: ["./pedido.component.scss"],
})
export class PedidoComponent implements OnInit, AfterViewInit {
  pedido: Pedido = new Pedido();
  @ViewChild("newProveedor", { static: true })
  newProveedor: NewProveedorComponent;
  fechaPedido: Date = new Date();
  fechaPago: Date = new Date();
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
      value: "Categoría",
      colname: "categoria",
      selected: false,
      default: false,
    },
    {
      id: 5,
      value: "Referencia",
      colname: "referencia",
      selected: false,
      default: false,
    },
    {
      id: 6,
      value: "Cod. Barras",
      colname: "codBarras",
      selected: false,
      default: false,
    },
    {
      id: 7,
      value: "Stock actual",
      colname: "stock",
      selected: false,
      default: false,
    },
    {
      id: 8,
      value: "Unidades",
      colname: "unidades",
      selected: true,
      default: true,
    },
    {
      id: 9,
      value: "Precio albarán",
      colname: "palb",
      selected: true,
      default: true,
    },
    {
      id: 10,
      value: "Subtotal",
      colname: "subtotal",
      selected: true,
      default: true,
    },
    { id: 11, value: "IVA", colname: "iva", selected: false, default: false },
    {
      id: 12,
      value: "Descuento",
      colname: "descuento",
      selected: false,
      default: false,
    },
    {
      id: 13,
      value: "PUC",
      colname: "puc",
      selected: true,
      default: true,
    },
    {
      id: 14,
      value: "Total",
      colname: "total",
      selected: true,
      default: true,
    },
    {
      id: 15,
      value: "PVP",
      colname: "pvp",
      selected: true,
      default: true,
    },
    {
      id: 16,
      value: "Margen",
      colname: "margen",
      selected: true,
      default: true,
    },
    {
      id: 17,
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

  pdfs: PedidoPDF[] = [];

  portes: number = 0;

  constructor(
    public ps: ProveedoresService,
    private ars: ArticulosService,
    private cms: ClassMapperService,
    private dialog: DialogService
  ) {}

  ngOnInit(): void {
    this.changeOptions();
    this.localizadorBox.nativeElement.focus();
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

  checkLocalizador(ev: KeyboardEvent): void {
    if (ev.key == "Enter") {
      ev.preventDefault();
      ev.stopPropagation();

      this.loadArticulo();
    }
  }

  loadArticulo(): void {
    this.ars.loadArticulo(this.nuevoLocalizador).subscribe((result) => {
      const articulo: Articulo = this.cms.getArticulo(result.articulo);

      const ind: number = this.pedido.lineas.findIndex((x: PedidoLinea) => {
        return x.localizador === articulo.localizador;
      });

      if (ind === -1) {
        const lineaPedido: PedidoLinea = new PedidoLinea().fromArticulo(
          articulo
        );
        this.pedido.lineas.push(lineaPedido);
        this.pedidoDataSource.data = this.pedido.lineas;
      } else {
        this.pedido.lineas[ind].unidades++;
      }

      this.nuevoLocalizador = null;
      this.localizadorBox.nativeElement.focus();
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
        const pdf: PedidoPDF = {
          id: null,
          data: reader.result as string,
          name: file.name,
        };
        this.pdfs.push(pdf);
        (<HTMLInputElement>document.getElementById("pdf-file")).value = "";
      };
    }
  }

  deletePDF(ind: number): void {
    this.pdfs.splice(ind, 1);
  }
}
