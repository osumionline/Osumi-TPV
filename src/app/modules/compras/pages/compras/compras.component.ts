import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import ComprasPedidosListComponent from '@modules/compras/components/compras-pedidos-list/compras-pedidos-list.component';
import MarcasComponent from '@modules/compras/components/marcas/marcas.component';
import ProveedoresComponent from '@modules/compras/components/proveedores/proveedores.component';
import ComprasService from '@services/compras.service';
import HeaderComponent from '@shared/components/header/header.component';

@Component({
  selector: 'otpv-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss'],
  imports: [
    ProveedoresComponent,
    MarcasComponent,
    ComprasPedidosListComponent,
    HeaderComponent,
    MatCard,
    MatCardContent,
    MatTabGroup,
    MatTab,
  ],
})
export default class ComprasComponent implements OnInit {
  private comprasService: ComprasService = inject(ComprasService);
  private router: Router = inject(Router);

  @ViewChild('compras', { static: true }) compras: ComprasPedidosListComponent;
  @ViewChild('marcas', { static: true }) marcas: MarcasComponent;
  @ViewChild('proveedores', { static: true }) proveedores: ProveedoresComponent;

  ngOnInit(): void {
    if (this.comprasService.pedidoCargado !== null) {
      this.router.navigate([
        '/compras/pedido/' + this.comprasService.pedidoCargado,
      ]);
      return;
    }
    if (this.comprasService.pedidoTemporal !== null) {
      this.router.navigate(['/compras/pedido/0']);
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
