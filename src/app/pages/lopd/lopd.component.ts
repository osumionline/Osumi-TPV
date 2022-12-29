import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Cliente } from "src/app/model/cliente.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ClientesService } from "src/app/services/clientes.service";
import { ConfigService } from "src/app/services/config.service";

@Component({
  selector: "otpv-lopd",
  templateUrl: "./lopd.component.html",
  styleUrls: ["./lopd.component.scss"],
})
export class LopdComponent implements OnInit {
  name: string = "";
  day: number = null;
  month: string = null;
  year: number = null;
  cliente: Cliente = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private config: ConfigService,
    private cs: ClientesService,
    private cms: ClassMapperService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.cs.getCliente(params.id).subscribe((result) => {
        this.name = this.config.nombre;

        const d: Date = new Date();
        this.day = d.getDate();
        this.month = this.config.monthList[d.getMonth()].name;
        this.year = d.getFullYear();

        this.cliente = this.cms.getCliente(result.cliente);
        console.log(this.cliente);

        setTimeout(() => {
          window.print();
        });
      });
    });
  }
}
