import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { PedidoPDF, PedidosColOption } from "src/app/interfaces/interfaces";
import { Articulo } from "src/app/model/articulo.model";
import { PedidoLinea } from "src/app/model/pedido-linea.model";
import { Pedido } from "src/app/model/pedido.model";
import { ArticulosService } from "src/app/services/articulos.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ProveedoresService } from "src/app/services/proveedores.service";

@Component({
  selector: "otpv-pedido",
  templateUrl: "./pedido.component.html",
  styleUrls: ["./pedido.component.scss"],
})
export class PedidoComponent implements OnInit, AfterViewInit {
  pedido: Pedido = new Pedido();
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
    private cms: ClassMapperService
  ) {}

  ngOnInit(): void {
    this.changeOptions();
    this.localizadorBox.nativeElement.focus();
  }

  ngAfterViewInit(): void {
    this.pedidoDataSource.sort = this.sort;
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

  borrarLinea(localizador: number): void {
    const ind: number = this.pedido.lineas.findIndex(
      (x: PedidoLinea): boolean => {
        return x.localizador === localizador;
      }
    );
    if (ind !== -1) {
      this.pedido.lineas.splice(ind, 1);
      this.pedidoDataSource.data = this.pedido.lineas;
    }
    this.localizadorBox.nativeElement.focus();
  }

  get totalArticulos(): number {
    let num: number = 0;
    for (let linea of this.pedido.lineas) {
      num += linea.unidades;
    }
    return num;
  }

  get totalBeneficios(): number {
    return 0;
  }

  get totalPVP(): number {
    let num: number = 0;
    for (let linea of this.pedido.lineas) {
      num += linea.pvp;
    }
    return num;
  }

  get subtotal(): number {
    let num: number = 0;
    for (let linea of this.pedido.lineas) {
      num += linea.subtotal;
    }
    return num;
  }

  get total(): number {
    let num: number = 0;
    for (let linea of this.pedido.lineas) {
      num += linea.total;
    }
    return num;
  }
}
