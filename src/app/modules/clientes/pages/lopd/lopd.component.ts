import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Cliente } from "src/app/model/clientes/cliente.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ClientesService } from "src/app/services/clientes.service";
import { ConfigService } from "src/app/services/config.service";

@Component({
  standalone: true,
  selector: "otpv-lopd",
  templateUrl: "./lopd.component.html",
  styleUrls: ["./lopd.component.scss"],
  imports: [CommonModule],
})
export default class LopdComponent implements OnInit {
  nombre: string = "";
  poblacion: string = "";
  day: number = null;
  month: string = null;
  year: number = null;
  cliente: Cliente = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private config: ConfigService,
    private cs: ClientesService,
    private cms: ClassMapperService
  ) {
    document.body.classList.add("white-bg");
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.cs.getCliente(params.id).subscribe((result) => {
        this.nombre = this.config.nombre;
        this.poblacion = this.config.poblacion;

        const d: Date = new Date();
        this.day = d.getDate();
        this.month = this.config.monthList[d.getMonth()].name;
        this.year = d.getFullYear();

        this.cliente = this.cms.getCliente(result.cliente);

        setTimeout(() => {
          window.print();
        });
      });
    });
  }
}
