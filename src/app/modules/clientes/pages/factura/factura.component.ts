import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Data, Params } from '@angular/router';
import { environment } from '@env/environment';
import {
  FacturaIVAInterface,
  FacturaResult,
} from '@interfaces/cliente.interface';
import { IdSaveResult } from '@interfaces/interfaces';
import FacturaItem from '@model/clientes/factura-item.model';
import Factura from '@model/clientes/factura.model';
import { DialogService } from '@osumi/angular-tools';
import ClassMapperService from '@services/class-mapper.service';
import ClientesService from '@services/clientes.service';
import ConfigService from '@services/config.service';
import FixedNumberPipe from '@shared/pipes/fixed-number.pipe';

@Component({
  selector: 'otpv-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.scss'],
  imports: [FixedNumberPipe, MatButton, MatIcon],
})
export default class FacturaComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  public config: ConfigService = inject(ConfigService);
  private cs: ClientesService = inject(ClientesService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private dialog: DialogService = inject(DialogService);

  broadcastChannel: BroadcastChannel = new BroadcastChannel('cliente-facturas');
  preview: boolean = false;
  logoUrl: string = environment.baseUrl + 'logo.jpg';
  deployedAll: boolean = false;
  factura: Factura = new Factura();
  list: FacturaItem[] = [];
  subtotal: number = 0;
  ivas: FacturaIVAInterface[] = [];
  descuento: number = 0;
  total: number = 0;

  constructor() {
    document.body.classList.add('white-bg');
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: Data): void => {
      this.preview = data.type === 'preview';
      this.start();
    });
  }

  start(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.loadFactura(parseInt(params.id));
    });
  }

  loadFactura(id: number): void {
    this.cs.getFactura(id).subscribe((result: FacturaResult): void => {
      this.factura = this.cms.getFactura(result.factura);
      this.loadData();
      if (this.factura.impresa) {
        setTimeout((): void => {
          window.print();
        });
      }
    });
  }

  loadData(): void {
    for (const venta of this.factura.ventas) {
      const temp: FacturaItem = new FacturaItem();
      temp.concepto = 'Ticket Nº ' + venta.id;
      temp.fecha = venta.fecha;
      temp.total = venta.total;

      for (const linea of venta.lineas) {
        const ventaLinea: FacturaItem = new FacturaItem();
        ventaLinea.concepto = linea.articulo;
        ventaLinea.precioIVA = linea.pvp;
        ventaLinea.precioSinIVA = linea.pvp / ((100 + linea.iva) / 100);
        ventaLinea.unidades = linea.unidades;
        ventaLinea.subtotal = linea.unidades * ventaLinea.precioSinIVA;
        ventaLinea.iva = linea.iva;
        ventaLinea.ivaImporte =
          linea.pvp * linea.unidades - ventaLinea.subtotal;
        ventaLinea.descuento = linea.totalDescuento;
        ventaLinea.total = linea.importe;

        temp.precioIVA += ventaLinea.unidades * ventaLinea.precioIVA;
        temp.precioSinIVA += ventaLinea.unidades * ventaLinea.precioSinIVA;
        //temp.unidades += ventaLinea.unidades;
        temp.subtotal += ventaLinea.subtotal;
        temp.ivaImporte += ventaLinea.ivaImporte;
        temp.descuento += ventaLinea.descuento;
        this.subtotal += ventaLinea.subtotal;
        this.addIva(ventaLinea.iva, ventaLinea.ivaImporte);
        this.descuento += ventaLinea.descuento;
        this.total += ventaLinea.total;

        temp.lineas.push(ventaLinea);
      }

      this.list.push(temp);
    }
  }

  addIva(iva: number, importe: number): void {
    const ind: number = this.ivas.findIndex(
      (x: FacturaIVAInterface): boolean => {
        return x.iva === iva;
      }
    );
    if (ind === -1) {
      this.ivas.push({ iva, importe });
    } else {
      this.ivas[ind].importe += importe;
    }
    this.ivas.sort(
      (a: FacturaIVAInterface, b: FacturaIVAInterface): number => a.iva - b.iva
    );
  }

  deployAll(): void {
    let mode: boolean = false;
    if (!this.deployedAll) {
      mode = true;
    }
    for (const item of this.list) {
      item.deployed = mode;
    }
    this.deployedAll = mode;
  }

  deploy(item: FacturaItem): void {
    item.deployed = !item.deployed;
  }

  imprimir(): void {
    this.dialog
      .confirm({
        title: 'Confirmar',
        content:
          '¿Estás seguro de querer imprimir esta factura? Una vez facturada no podrás volver a editarla.',
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.saveFactura();
        }
      });
  }

  saveFactura(): void {
    this.cs
      .saveFactura(this.factura.toSaveInterface(true))
      .subscribe((result: IdSaveResult): void => {
        if (result.status === 'ok') {
          this.preview = false;
          this.broadcastChannel.postMessage({
            type: 'imprimir',
            id: this.factura.idCliente,
          });
          this.loadFactura(this.factura.id);
        }
      });
  }
}
