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
      console.log(venta);
      let temp: FacturaItem = new FacturaItem();
      temp.concepto = "Ticket Nº " + venta.id;
      temp.fecha = venta.fecha;
      temp.total = venta.total;

      for (let linea of venta.lineas) {
        let ventaLinea: FacturaItem = new FacturaItem();
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
        temp.unidades += ventaLinea.unidades;
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
    let ind: number = this.ivas.findIndex((x): boolean => {
      return x.iva === iva;
    });
    if (ind === -1) {
      this.ivas.push({ iva, importe });
    } else {
      this.ivas[ind].importe += importe;
    }
    this.ivas.sort((a, b) => a.iva - b.iva);
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
