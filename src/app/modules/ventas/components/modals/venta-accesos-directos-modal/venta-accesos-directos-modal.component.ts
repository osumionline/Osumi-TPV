import { Component, inject, OnInit } from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AccesoDirectoResult } from '@interfaces/articulo.interface';
import AccesoDirecto from '@model/articulos/acceso-directo.model';
import { CustomOverlayRef } from '@model/tpv/custom-overlay-ref.model';
import ArticulosService from '@services/articulos.service';
import ClassMapperService from '@services/class-mapper.service';

@Component({
  standalone: true,
  selector: 'otpv-venta-accesos-directos-modal',
  templateUrl: './venta-accesos-directos-modal.component.html',
  imports: [MatSortModule, MatTableModule],
})
export default class VentaAccesosDirectosModalComponent implements OnInit {
  private ars: ArticulosService = inject(ArticulosService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private customOverlayRef: CustomOverlayRef<null, {}> =
    inject(CustomOverlayRef);

  accesosDirectosList: AccesoDirecto[] = [];
  accesosDirectosDisplayedColumns: string[] = ['accesoDirecto', 'nombre'];
  accesosDirectosDataSource: MatTableDataSource<AccesoDirecto> =
    new MatTableDataSource<AccesoDirecto>();

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
