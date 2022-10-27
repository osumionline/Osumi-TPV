import { Component, OnInit } from "@angular/core";
import { Cliente } from "src/app/model/cliente.model";
import { ClientesService } from "src/app/services/clientes.service";

@Component({
  selector: "otpv-clientes",
  templateUrl: "./clientes.component.html",
  styleUrls: ["./clientes.component.scss"],
})
export class ClientesComponent implements OnInit {
  selectedClient: Cliente = null;

  constructor(public cs: ClientesService) {}

  ngOnInit(): void {
    this.cs.load();
  }

  selectCliente(cliente: Cliente): void {
    this.selectedClient = cliente;
  }
}
