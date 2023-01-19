import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Data, Params, Router } from "@angular/router";
import { IdSaveResult } from "src/app/interfaces/interfaces";
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
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
      if (this.factura.impresa) {
        setTimeout(() => {
          window.print();
        });
      }
    });
  }

  imprimir(): void {
    this.dialog
      .confirm({
        title: "Confirmar",
        content:
          "¿Estás seguro de querer imprimir esta factura? Una vez impresa no podrás volver a editarla.",
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
