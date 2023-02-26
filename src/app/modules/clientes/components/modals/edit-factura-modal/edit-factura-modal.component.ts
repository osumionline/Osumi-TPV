import { SelectionModel } from "@angular/cdk/collections";
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { IdSaveResult, StatusResult } from "src/app/interfaces/interfaces";
import { VentaHistorico } from "src/app/model/caja/venta-historico.model";
import { VentaLineaHistorico } from "src/app/model/caja/venta-linea-historico.model";
import { Factura } from "src/app/model/clientes/factura.model";
import { CustomOverlayRef } from "src/app/model/tpv/custom-overlay-ref.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { FixedNumberPipe } from "src/app/modules/shared/pipes/fixed-number.pipe";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ClientesService } from "src/app/services/clientes.service";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  standalone: true,
  selector: "otpv-edit-factura-modal",
  templateUrl: "./edit-factura-modal.component.html",
  styleUrls: ["./edit-factura-modal.component.scss"],
  imports: [CommonModule, MaterialModule, FixedNumberPipe],
})
export class EditFacturaModalComponent implements OnInit {
  title: string = "Selecciona las ventas que quieras incluir en la factura:";
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

  constructor(
    private cs: ClientesService,
    private cms: ClassMapperService,
    private dialog: DialogService,
    private customOverlayRef: CustomOverlayRef<
      null,
      { id: number; factura: Factura }
    >
  ) {}

  ngOnInit(): void {
    this.ventaSelected = new VentaHistorico();
    if (this.customOverlayRef.data.id !== null) {
      this.ventasDisplayedColumns = [
        "select",
        "fecha",
        "importe",
        "nombreTipoPago",
      ];
      this.loadVentas(this.customOverlayRef.data.id);
    }
    if (this.customOverlayRef.data.factura !== null) {
      this.abreFactura(this.customOverlayRef.data.factura);
    }
  }

  abreFactura(factura: Factura): void {
    this.factura = factura;
    this.title = "Ventas incluidas en la factura " + this.factura.id + ":";
    this.ventaSelected = new VentaHistorico();
    if (this.factura.impresa) {
      this.ventasDisplayedColumns = ["fecha", "importe", "nombreTipoPago"];
      this.ventasCliente = this.factura.ventas;
      this.ventasDataSource.data = this.ventasCliente;
    } else {
      this.ventasDisplayedColumns = [
        "select",
        "fecha",
        "importe",
        "nombreTipoPago",
      ];
      this.cs
        .getVentas(this.factura.idCliente, this.factura.id)
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
        });
    }
  }

  loadVentas(id: number): void {
    this.cs.getVentas(id).subscribe((result) => {
      this.factura = new Factura();
      this.factura.idCliente = id;
      this.ventasCliente = this.cms.getHistoricoVentas(result.list);
      this.ventasDataSource.data = this.ventasCliente;
    });
  }

  isAllSelected(): boolean {
    const numSelected: number = this.selection.selected.length;
    const numRows: number = this.ventasDataSource.data.filter(
      (v: VentaHistorico): boolean => {
        return v.statusFactura === "no";
      }
    ).length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.ventasDataSource.data.forEach((v: VentaHistorico): void => {
          v.statusFactura === "no" && this.selection.select(v);
        });
  }

  selectVenta(ind: number): void {
    this.ventaSelected = this.ventasCliente[ind];
    console.log(this.ventaSelected);
    this.ventaSelectedDataSource.data = this.ventaSelected.lineas;
  }

  saveFactura(): void {
    this.factura.ventas = [];
    this.selection.selected.forEach((v: VentaHistorico): void => {
      this.factura.ventas.push(v);
    });
    this.cs
      .saveFactura(this.factura.toSaveInterface())
      .subscribe((result: IdSaveResult) => {
        if (result.status === "ok") {
          this.customOverlayRef.close(result.id);
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
          this.customOverlayRef.close(0);
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
          window.open("/clientes/factura/" + result.id + "/preview");
          this.customOverlayRef.close(result.id);
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
          window.open("/clientes/factura/" + result.id);
          this.customOverlayRef.close(result.id);
        }
      });
  }
}
