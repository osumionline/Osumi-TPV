import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Cliente } from "src/app/model/cliente.model";
import { ClientesService } from "src/app/services/clientes.service";
import { ConfigService } from "src/app/services/config.service";

@Component({
  selector: "otpv-clientes",
  templateUrl: "./clientes.component.html",
  styleUrls: ["./clientes.component.scss"],
})
export class ClientesComponent implements OnInit {
  search: string = "";
  @ViewChild("searchBox", { static: true }) searchBox: ElementRef;
  start: boolean = true;
  selectedClient: Cliente = new Cliente();

  constructor(public cs: ClientesService, public config: ConfigService) {}

  ngOnInit(): void {
    this.config.start();
    this.cs.load();
    this.searchBox.nativeElement.focus();
  }

  selectCliente(cliente: Cliente): void {
    this.start = false;
    this.selectedClient = cliente;
  }

  newCliente(): void {
    this.start = false;
    this.selectedClient = new Cliente();
  }
}
