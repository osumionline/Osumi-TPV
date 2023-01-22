import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Data, Params } from "@angular/router";
import { IdSaveResult } from "src/app/interfaces/interfaces";
import { FacturaItem } from "src/app/model/factura-item.model";
import { Factura } from "src/app/model/factura.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ClientesService } from "src/app/services/clientes.service";
import { ConfigService } from "src/app/services/config.service";
import { DialogService } from "src/app/services/dialog.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "otpv-factura",
  templateUrl: "./factura.component.html",
  styleUrls: ["./factura.component.scss"],
})
export class FacturaComponent implements OnInit {
  preview: boolean = false;
  logoUrl: string = environment.baseUrl + "logo.jpg";
  factura: Factura = new Factura();
  list: FacturaItem[] = [];
  subtotal: number = 0;
  ivas: { iva: number; importe: number }[] = [];
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
    this.activatedRoute.data.subscribe((data: Data) => {
      this.preview = data.type === "preview";
      this.start();
    });
  }

  start(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.loadFactura(parseInt(params.id));
    });
  }

  loadFactura(id: number): void {
    this.cs.getFactura(id).subscribe((result) => {
      this.factura = this.cms.getFactura(result.factura);
      this.loadData();
      if (this.factura.impresa) {
        setTimeout(() => {
          window.print();
        });
      }
    });
  }

  loadData(): void {
    for (let venta of this.factura.ventas) {
      let ventaTemp = {};
      for (let linea of venta.lineas) {
        if (!ventaTemp.hasOwnProperty("iva_" + linea.iva)) {
          ventaTemp["iva_" + linea.iva] = new FacturaItem();
          ventaTemp["iva_" + linea.iva].concepto = "Ticket Nº " + venta.id;
          ventaTemp["iva_" + linea.iva].iva = linea.iva;
          ventaTemp["iva_" + linea.iva].unidades = 0;
        }

        let ventaLinea: FacturaItem = new FacturaItem();
        ventaLinea.concepto = linea.articulo;
        ventaLinea.precioIVA = linea.pvp;
        ventaLinea.precioSinIVA = linea.pvp / ((100 + linea.iva) / 100);
        ventaLinea.unidades = linea.unidades;
        ventaLinea.subtotal = linea.unidades * ventaLinea.precioSinIVA;
        ventaLinea.iva = linea.iva;
        ventaLinea.ivaImporte =
          linea.pvp * linea.unidades - ventaLinea.subtotal;
        ventaLinea.total = linea.importe;

        ventaTemp["iva_" + linea.iva].lineas.push(ventaLinea);
      }
      for (let iva in ventaTemp) {
        for (let linea of ventaTemp[iva].lineas) {
          ventaTemp[iva].precioIVA += linea.precioIVA;
          ventaTemp[iva].precioSinIVA += linea.precioSinIVA;
          ventaTemp[iva].unidades += linea.unidades;
          ventaTemp[iva].subtotal += linea.subtotal;
          ventaTemp[iva].ivaImporte += linea.ivaImporte;
          ventaTemp[iva].total += linea.total;

          this.subtotal += linea.subtotal;
          this.addIva(linea.iva, linea.ivaImporte);
          this.total += linea.total;
        }
        this.list.push(ventaTemp[iva]);
      }
    }
  }

  addIva(iva: number, importe: number): void {
    let ind: number = this.ivas.findIndex((x): boolean => {
      return x.iva === iva;
    });
    if (ind === -1) {
      this.ivas.push({ iva, importe });
    } else {
      this.ivas[ind].importe += importe;
    }
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
      .subscribe((result) => {
        if (result === true) {
          this.saveFactura();
        }
      });
  }

  saveFactura(): void {
    this.cs
      .saveFactura(this.factura.toSaveInterface(true))
      .subscribe((result: IdSaveResult) => {
        if (result.status === "ok") {
          this.preview = false;
          this.loadFactura(this.factura.id);
        }
      });
  }
}
