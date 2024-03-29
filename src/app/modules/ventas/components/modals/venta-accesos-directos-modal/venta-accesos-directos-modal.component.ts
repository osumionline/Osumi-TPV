import { Component, OnInit } from "@angular/core";
import { MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { AccesoDirectoResult } from "@interfaces/articulo.interface";
import { AccesoDirecto } from "@model/articulos/acceso-directo.model";
import { CustomOverlayRef } from "@model/tpv/custom-overlay-ref.model";
import { ArticulosService } from "@services/articulos.service";
import { ClassMapperService } from "@services/class-mapper.service";

@Component({
  standalone: true,
  selector: "otpv-venta-accesos-directos-modal",
  templateUrl: "./venta-accesos-directos-modal.component.html",
  imports: [MatSortModule, MatTableModule],
})
export class VentaAccesosDirectosModalComponent implements OnInit {
  accesosDirectosList: AccesoDirecto[] = [];
  accesosDirectosDisplayedColumns: string[] = ["accesoDirecto", "nombre"];
  accesosDirectosDataSource: MatTableDataSource<AccesoDirecto> =
    new MatTableDataSource<AccesoDirecto>();

  constructor(
    private ars: ArticulosService,
    private cms: ClassMapperService,
    private customOverlayRef: CustomOverlayRef<null, {}>
  ) {}

  ngOnInit(): void {
    this.ars
      .getAccesosDirectosList()
      .subscribe((result: AccesoDirectoResult): void => {
        this.accesosDirectosList = this.cms.getAccesosDirectos(result.list);
        this.accesosDirectosDataSource.data = this.accesosDirectosList;
      });
  }

  selectAccesoDirecto(row: AccesoDirecto): void {
    this.customOverlayRef.close(row.accesoDirecto);
  }
}
