import { Component, OnInit, ViewChild } from '@angular/core';
import { Tabs, Venta, LineaVenta } from '../../interfaces/interfaces';
import { UnaVentaComponent } from '../una-venta/una-venta.component';

@Component({
  selector: 'otpv-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  tabs = {
    selected: 0,
	names: []
  } as Tabs;
  ventas: Venta[] = [];
  
  @ViewChild('venta', { static: true }) venta: UnaVentaComponent;

  constructor() {}
  ngOnInit() {
    this.newVenta();
  }

  cerrarVenta(ind: number) {
    if (this.tabs.selected==ind){
      this.tabs.selected = 0;
    }
    this.tabs.names.splice(ind, 1);
	this.ventas.splice(ind, 1);
  }

  newVenta() {
    this.tabs.names.push('VENTA '+(this.tabs.names.length+1));
	this.tabs.selected = (this.tabs.names.length-1);
	this.ventas.push({
      lineas: [],
      importe: 0
	} as Venta);

	setTimeout(() => {
	  this.venta.addLineaVenta();
	}, 200);
  }
}