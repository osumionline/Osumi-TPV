import { Component, OnInit, ViewChild } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatTabChangeEvent, MatTabsModule } from "@angular/material/tabs";
import { Router } from "@angular/router";
import { ComprasPedidosListComponent } from "src/app/modules/compras/components/compras-pedidos-list/compras-pedidos-list.component";
import { MarcasComponent } from "src/app/modules/compras/components/marcas/marcas.component";
import { ProveedoresComponent } from "src/app/modules/compras/components/proveedores/proveedores.component";
import { HeaderComponent } from "src/app/modules/shared/components/header/header.component";
import { ComprasService } from "src/app/services/compras.service";

@Component({
  standalone: true,
  selector: "otpv-compras",
  templateUrl: "./compras.component.html",
  styleUrls: ["./compras.component.scss"],
  imports: [
    ProveedoresComponent,
    MarcasComponent,
    ComprasPedidosListComponent,
    HeaderComponent,
    MatCardModule,
    MatTabsModule,
  ],
})
export default class ComprasComponent implements OnInit {
  @ViewChild("compras", { static: true }) compras: ComprasPedidosListComponent;
  @ViewChild("marcas", { static: true }) marcas: MarcasComponent;
  @ViewChild("proveedores", { static: true }) proveedores: ProveedoresComponent;

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

  tabChange(ev: MatTabChangeEvent): void {
    if (ev.index === 1) {
      this.marcas.searchFocus();
    }
    if (ev.index === 2) {
      this.proveedores.searchFocus();
    }
  }
}
