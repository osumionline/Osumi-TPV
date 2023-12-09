import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, Data, Params } from "@angular/router";
import {
  FacturaIVAInterface,
  FacturaResult,
} from "src/app/interfaces/cliente.interface";
import { IdSaveResult } from "src/app/interfaces/interfaces";
import { FacturaItem } from "src/app/model/clientes/factura-item.model";
import { Factura } from "src/app/model/clientes/factura.model";
import { FixedNumberPipe } from "src/app/modules/shared/pipes/fixed-number.pipe";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ClientesService } from "src/app/services/clientes.service";
import { ConfigService } from "src/app/services/config.service";
import { DialogService } from "src/app/services/dialog.service";
import { environment } from "src/environments/environment";

@Component({
  standalone: true,
  selector: "otpv-factura",
  templateUrl: "./factura.component.html",
  styleUrls: ["./factura.component.scss"],
  imports: [CommonModule, FixedNumberPipe, MatButtonModule],
})
export default class FacturaComponent implements OnInit {
  broadcastChannel: BroadcastChannel = new BroadcastChannel("cliente-facturas");
  preview: boolean = false;
  logoUrl: string = environment.baseUrl + "logo.jpg";
  deployedAll: boolean = false;
  factura: Factura = new Factura();
  list: FacturaItem[] = [];
  subtotal: number = 0;
  ivas: FacturaIVAInterface[] = [];
  descuento: number = 0;
  total: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    public config: ConfigService,
    private cs: ClientesService,
    private cms: ClassMapperService,
    private dialog: DialogService
  ) {
    document.body.classList.add("white-bg");
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: Data): void => {
      this.preview = data.type === "preview";
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
      temp.concepto = "Ticket Nº " + venta.id;
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
        title: "Confirmar",
        content:
          "¿Estás seguro de querer imprimir esta factura? Una vez facturada no podrás volver a editarla.",
        ok: "Continuar",
        cancel: "Cancelar",
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
        if (result.status === "ok") {
          this.preview = false;
          this.broadcastChannel.postMessage({
            type: "imprimir",
            id: this.factura.idCliente,
          });
          this.loadFactura(this.factura.id);
        }
      });
  }
}
