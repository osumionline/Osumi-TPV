import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Cliente } from "src/app/model/cliente.model";
import { ClientesService } from "src/app/services/clientes.service";

@Component({
  selector: "otpv-clientes",
  templateUrl: "./clientes.component.html",
  styleUrls: ["./clientes.component.scss"],
})
export class ClientesComponent implements OnInit {
  search: string = "";
  @ViewChild("searchBox", { static: true }) searchBox: ElementRef;
  selectedClient: Cliente = null;

  constructor(public cs: ClientesService) {
    this.cs.load();
  }

  ngOnInit(): void {
    this.cs.load();
    this.searchBox.nativeElement.focus();
  }

  selectCliente(cliente: Cliente): void {
    this.selectedClient = cliente;
  }

  newCliente(): void {
    this.selectedClient = new Cliente();
  }
}
