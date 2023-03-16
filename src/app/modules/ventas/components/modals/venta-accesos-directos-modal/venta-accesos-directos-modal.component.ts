import { Component, OnInit } from "@angular/core";
import { MatSortModule } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { AccesoDirecto } from "src/app/model/articulos/acceso-directo.model";
import { CustomOverlayRef } from "src/app/model/tpv/custom-overlay-ref.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { ArticulosService } from "src/app/services/articulos.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";

@Component({
  standalone: true,
  selector: "otpv-venta-accesos-directos-modal",
  templateUrl: "./venta-accesos-directos-modal.component.html",
  styleUrls: ["./venta-accesos-directos-modal.component.scss"],
  imports: [MaterialModule, MatSortModule],
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
    this.ars.getAccesosDirectosList().subscribe((result) => {
      this.accesosDirectosList = this.cms.getAccesosDirectos(result.list);
      this.accesosDirectosDataSource.data = this.accesosDirectosList;
    });
  }

  selectAccesoDirecto(row: AccesoDirecto): void {
    this.customOverlayRef.close(row.accesoDirecto);
  }
}
