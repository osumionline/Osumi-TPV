import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ComprasPedidosListComponent } from "src/app/components/compras/compras-pedidos-list/compras-pedidos-list.component";
import { ComprasService } from "src/app/services/compras.service";

@Component({
  selector: "otpv-compras",
  templateUrl: "./compras.component.html",
  styleUrls: ["./compras.component.scss"],
})
export class ComprasComponent implements OnInit {
  @ViewChild("compras", { static: true }) compras: ComprasPedidosListComponent;

  constructor(private comprasService: ComprasService, private router: Router) {}

  ngOnInit(): void {
    if (this.comprasService.pedidoCargado !== null) {
      this.router.navigate([
        "/compras/pedido/" + this.comprasService.pedidoCargado,
      ]);
      return;
    }
    if (this.comprasService.pedidoTemporal !== null) {
      this.router.navigate(["/compras/pedido/0"]);
      return;
    }
    this.compras.load();
  }
}
