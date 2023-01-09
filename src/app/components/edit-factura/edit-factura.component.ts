import { SelectionModel } from "@angular/cdk/collections";
import { Component, HostListener } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Cliente } from "src/app/model/cliente.model";
import { VentaHistorico } from "src/app/model/venta-historico.model";
import { VentaLineaHistorico } from "src/app/model/venta-linea-historico.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ClientesService } from "src/app/services/clientes.service";

@Component({
  selector: "otpv-edit-factura",
  templateUrl: "./edit-factura.component.html",
  styleUrls: ["./edit-factura.component.scss"],
})
export class EditFacturaComponent {
  facturasTitle: string = "Nueva factura";
  showFacturas: boolean = false;

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

  constructor(private cs: ClientesService, private cms: ClassMapperService) {}

  @HostListener("window:keydown", ["$event"])
  onKeyDown(ev: KeyboardEvent) {
    if (ev.key === "Escape") {
      if (this.showFacturas) {
        this.facturasCerrar();
      }
    }
  }

  abrirFacturas(selectedClient: Cliente): void {
    this.cs.getVentas(selectedClient.id, "no").subscribe((result) => {
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
}
