import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Cliente } from "src/app/model/cliente.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ClientesService } from "src/app/services/clientes.service";

@Component({
  selector: "otpv-lopd",
  templateUrl: "./lopd.component.html",
  styleUrls: ["./lopd.component.scss"],
})
export class LopdComponent implements OnInit {
  cliente: Cliente = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private cs: ClientesService,
    private cms: ClassMapperService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.cs.getCliente(params.id).subscribe((result) => {
        this.cliente = this.cms.getCliente(result.cliente);

        setTimeout(() => {
          window.print();
        });
      });
    });
  }
}
