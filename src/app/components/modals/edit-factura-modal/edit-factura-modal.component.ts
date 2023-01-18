import { SelectionModel } from "@angular/cdk/collections";
import { Component, EventEmitter, HostListener, Output } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { IdSaveResult, StatusResult } from "src/app/interfaces/interfaces";
import { Cliente } from "src/app/model/cliente.model";
import { Factura } from "src/app/model/factura.model";
import { VentaHistorico } from "src/app/model/venta-historico.model";
import { VentaLineaHistorico } from "src/app/model/venta-linea-historico.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ClientesService } from "src/app/services/clientes.service";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  selector: "otpv-edit-factura-modal",
  templateUrl: "./edit-factura-modal.component.html",
  styleUrls: ["./edit-factura-modal.component.scss"],
})
export class EditFacturaModalComponent {
  facturasTitle: string = "Nueva factura";
  showFacturas: boolean = false;

  factura: Factura = new Factura();

  ventasDisplayedColumns: string[] = [
    "select",
    "fecha",
    "importe",
    "nombreTipoPago",
  ];
  ventasCliente: VentaHistorico[] = [];
  ventasDataSource: MatTableDataSource<VentaHistorico> =
    new MatTableDataSource<VentaHistorico>();
  ventasSelected: VentaHistorico = new VentaHistorico();
  selection: SelectionModel<VentaHistorico> =
    new SelectionModel<VentaHistorico>(true, []);

  ventaSelected: VentaHistorico = new VentaHistorico();
  ventaSelectedDisplayedColumns: string[] = [
    "localizador",
    "marca",
    "articulo",
    "unidades",
    "pvp",
    "descuento",
    "importe",
  ];
  ventaSelectedDataSource: MatTableDataSource<VentaLineaHistorico> =
    new MatTableDataSource<VentaLineaHistorico>();

  @Output() saveEvent: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private cs: ClientesService,
    private cms: ClassMapperService,
    private dialog: DialogService
  ) {}

  @HostListener("window:keydown", ["$event"])
  onKeyDown(ev: KeyboardEvent) {
    if (ev.key === "Escape") {
      if (this.showFacturas) {
        this.facturasCerrar();
      }
    }
  }

  nuevaFactura(selectedClient: Cliente): void {
    this.ventaSelected = new VentaHistorico();
    this.ventasDisplayedColumns = [
      "select",
      "fecha",
      "importe",
      "nombreTipoPago",
    ];
    this.loadVentas(selectedClient.id);
  }

  abreFactura(factura: Factura): void {
    this.factura = factura;
    this.ventaSelected = new VentaHistorico();
    this.facturasTitle = "Factura " + this.factura.id;
    if (this.factura.impresa) {
      this.ventasDisplayedColumns = ["fecha", "importe", "nombreTipoPago"];
      this.ventasCliente = this.factura.ventas;
      this.ventasDataSource.data = this.ventasCliente;
      this.showFacturas = true;
    } else {
      this.ventasDisplayedColumns = [
        "select",
        "fecha",
        "importe",
        "nombreTipoPago",
      ];
      this.cs
        .getVentas(this.factura.idCliente, "no", this.factura.id)
        .subscribe((result) => {
          this.ventasCliente = this.cms.getHistoricoVentas(result.list);
          this.ventasDataSource.data = this.ventasCliente;
          this.selection.clear();
          for (let venta of this.factura.ventas) {
            let ind: number = this.ventasCliente.findIndex(
              (x: VentaHistorico): boolean => {
                return x.id === venta.id;
              }
            );
            this.selection.select(this.ventasCliente[ind]);
          }
          this.showFacturas = true;
        });
    }
  }

  loadVentas(id: number): void {
    this.cs.getVentas(id, "no").subscribe((result) => {
      this.factura = new Factura();
      this.factura.idCliente = id;
      this.ventasCliente = this.cms.getHistoricoVentas(result.list);
      this.ventasDataSource.data = this.ventasCliente;
      this.showFacturas = true;
    });
  }

  facturasCerrar(ev: MouseEvent = null): void {
    ev && ev.preventDefault();
    this.showFacturas = false;
    this.selection.clear();
  }

  isAllSelected(): boolean {
    const numSelected: number = this.selection.selected.length;
    const numRows: number = this.ventasDataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.ventasDataSource.data.forEach((row) => this.selection.select(row));
  }

  selectVenta(ind: number): void {
    this.ventaSelected = this.ventasCliente[ind];
    this.ventaSelectedDataSource.data = this.ventaSelected.lineas;
  }

  saveFactura(): void {
    this.factura.ventas = [];
    this.selection.selected.forEach((v: VentaHistorico) => {
      this.factura.ventas.push(v);
    });
    this.cs
      .saveFactura(this.factura.toSaveInterface())
      .subscribe((result: IdSaveResult) => {
        if (result.status === "ok") {
          this.facturasCerrar();
          this.saveEvent.emit(result.id);
        }
      });
  }

  deleteFactura(): void {
    this.dialog
      .confirm({
        title: "Borrar factura",
        content: "¿Estás seguro de querer borrar esta factura?",
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result) => {
        if (result === true) {
          this.confirmDeleteFactura();
        }
      });
  }

  confirmDeleteFactura(): void {
    this.cs.deleteFactura(this.factura.id).subscribe((result: StatusResult) => {
      this.dialog
        .alert({
          title: "Factura borrada",
          content: "La factura ha sido correctamente borrada.",
          ok: "Continuar",
        })
        .subscribe((result) => {
          this.facturasCerrar();
          this.saveEvent.emit(0);
        });
    });
  }

  preview(): void {
    this.factura.ventas = [];
    this.selection.selected.forEach((v: VentaHistorico) => {
      this.factura.ventas.push(v);
    });
    this.cs
      .saveFactura(this.factura.toSaveInterface())
      .subscribe((result: IdSaveResult) => {
        if (result.status === "ok") {
          this.facturasCerrar();
          this.saveEvent.emit(result.id);
          window.open("/factura/" + result.id + "/preview");
        }
      });
  }

  imprimir(): void {
    this.factura.ventas = [];
    this.selection.selected.forEach((v: VentaHistorico) => {
      this.factura.ventas.push(v);
    });
    this.cs
      .saveFactura(this.factura.toSaveInterface(true))
      .subscribe((result: IdSaveResult) => {
        if (result.status === "ok") {
          this.facturasCerrar();
          this.saveEvent.emit(result.id);
          window.open("/factura/" + result.id);
        }
      });
  }
}
