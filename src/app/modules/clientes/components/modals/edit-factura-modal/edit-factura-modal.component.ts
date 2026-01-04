import { SelectionModel } from '@angular/cdk/collections';
import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { VentasClienteResult } from '@interfaces/cliente.interface';
import { IdSaveResult, StatusResult } from '@interfaces/interfaces';
import VentaHistorico from '@model/caja/venta-historico.model';
import VentaLineaHistorico from '@model/caja/venta-linea-historico.model';
import Factura from '@model/clientes/factura.model';
import ApiStatusEnum from '@model/enum/api-status.enum';
import FixedNumberPipe from '@modules/shared/pipes/fixed-number.pipe';
import { CustomOverlayRef, DialogService } from '@osumi/angular-tools';
import ClassMapperService from '@services/class-mapper.service';
import ClientesService from '@services/clientes.service';

@Component({
  selector: 'otpv-edit-factura-modal',
  templateUrl: './edit-factura-modal.component.html',
  styleUrls: ['./edit-factura-modal.component.scss'],
  imports: [FixedNumberPipe, MatTableModule, MatCheckbox, MatButton, MatIcon],
})
export default class EditFacturaModalComponent implements OnInit {
  private readonly cs: ClientesService = inject(ClientesService);
  private readonly cms: ClassMapperService = inject(ClassMapperService);
  private readonly dialog: DialogService = inject(DialogService);
  private readonly customOverlayRef: CustomOverlayRef<null, { id: number; factura: Factura }> =
    inject(CustomOverlayRef);

  title: string = 'Selecciona las ventas que quieras incluir en la factura:';
  factura: Factura = new Factura();

  ventasDisplayedColumns: string[] = ['select', 'fecha', 'importe', 'nombreTipoPago'];
  ventasCliente: VentaHistorico[] = [];
  ventasDataSource: MatTableDataSource<VentaHistorico> = new MatTableDataSource<VentaHistorico>();
  ventasSelected: VentaHistorico = new VentaHistorico();
  selection: SelectionModel<VentaHistorico> = new SelectionModel<VentaHistorico>(true, []);

  ventaSelected: VentaHistorico = new VentaHistorico();
  ventaSelectedDisplayedColumns: string[] = [
    'localizador',
    'marca',
    'articulo',
    'unidades',
    'pvp',
    'descuento',
    'importe',
  ];
  ventaSelectedDataSource: MatTableDataSource<VentaLineaHistorico> =
    new MatTableDataSource<VentaLineaHistorico>();

  ngOnInit(): void {
    this.ventaSelected = new VentaHistorico();
    if (this.customOverlayRef.data.id !== null) {
      this.ventasDisplayedColumns = ['select', 'fecha', 'importe', 'nombreTipoPago'];
      this.loadVentas(this.customOverlayRef.data.id);
    }
    if (this.customOverlayRef.data.factura !== null) {
      this.abreFactura(this.customOverlayRef.data.factura);
    }
  }

  abreFactura(factura: Factura): void {
    this.factura = factura;
    this.title = 'Ventas incluidas en la factura ' + this.factura.id + ':';
    this.ventaSelected = new VentaHistorico();
    if (this.factura.impresa) {
      this.ventasDisplayedColumns = ['fecha', 'importe', 'nombreTipoPago'];
      this.ventasCliente = this.factura.ventas;
      this.ventasDataSource.data = this.ventasCliente;
    } else {
      this.ventasDisplayedColumns = ['select', 'fecha', 'importe', 'nombreTipoPago'];
      this.cs
        .getVentas(this.factura.idCliente as number, this.factura.id)
        .subscribe((result: VentasClienteResult): void => {
          this.ventasCliente = this.cms.getHistoricoVentas(result.list);
          this.ventasDataSource.data = this.ventasCliente;
          this.selection.clear();
          for (const venta of this.factura.ventas) {
            const ind: number = this.ventasCliente.findIndex((x: VentaHistorico): boolean => {
              return x.id === venta.id;
            });
            this.selection.select(this.ventasCliente[ind]);
          }
        });
    }
  }

  loadVentas(id: number): void {
    this.cs.getVentas(id).subscribe((result: VentasClienteResult): void => {
      this.factura = new Factura();
      this.factura.idCliente = id;
      this.ventasCliente = this.cms.getHistoricoVentas(result.list);
      this.ventasDataSource.data = this.ventasCliente;
    });
  }

  isAllSelected(): boolean {
    const numSelected: number = this.selection.selected.length;
    const numRows: number = this.ventasDataSource.data.filter((v: VentaHistorico): boolean => {
      return v.statusFactura === 'no';
    }).length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.ventasDataSource.data.forEach((v: VentaHistorico): void => {
        if (v.statusFactura === 'no') {
          this.selection.select(v);
        }
      });
    }
  }

  selectVenta(ind: number): void {
    this.ventaSelected = this.ventasCliente[ind];
    this.ventaSelectedDataSource.data = this.ventaSelected.lineas;
  }

  saveFactura(): void {
    this.factura.ventas = [];
    this.selection.selected.forEach((v: VentaHistorico): void => {
      this.factura.ventas.push(v);
    });
    this.cs.saveFactura(this.factura.toSaveInterface()).subscribe((result: IdSaveResult) => {
      if (result.status === ApiStatusEnum.OK) {
        this.customOverlayRef.close(result.id);
      }
    });
  }

  deleteFactura(): void {
    this.dialog
      .confirm({
        title: 'Borrar factura',
        content: '¿Estás seguro de querer borrar esta factura?',
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.confirmDeleteFactura();
        }
      });
  }

  confirmDeleteFactura(): void {
    this.cs.deleteFactura(this.factura.id as number).subscribe((result: StatusResult): void => {
      if (result.status === ApiStatusEnum.OK) {
        this.dialog
          .alert({
            title: 'Factura borrada',
            content: 'La factura ha sido correctamente borrada.',
          })
          .subscribe((): void => {
            this.customOverlayRef.close(0);
          });
      } else {
        this.dialog.alert({
          title: 'Error',
          content: 'Ha ocurrido un error al borrar la factura.',
        });
      }
    });
  }

  preview(): void {
    this.factura.ventas = [];
    this.selection.selected.forEach((v: VentaHistorico): void => {
      this.factura.ventas.push(v);
    });
    this.cs.saveFactura(this.factura.toSaveInterface()).subscribe((result: IdSaveResult): void => {
      if (result.status === ApiStatusEnum.OK) {
        window.open('/clientes/factura/' + result.id + '/preview');
        this.customOverlayRef.close(result.id);
      }
    });
  }

  imprimir(): void {
    this.factura.ventas = [];
    this.selection.selected.forEach((v: VentaHistorico): void => {
      this.factura.ventas.push(v);
    });
    this.cs
      .saveFactura(this.factura.toSaveInterface(true))
      .subscribe((result: IdSaveResult): void => {
        if (result.status === ApiStatusEnum.OK) {
          window.open('/clientes/factura/' + result.id);
          this.customOverlayRef.close(result.id);
        }
      });
  }
}
