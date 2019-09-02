import { Component, OnInit } from '@angular/core';
import { Tabs, Venta }       from '../../interfaces/interfaces';

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

  constructor() {}
  ngOnInit() {
    this.newVenta();
  }
  
  cerrarVenta(ind: number){
    if (this.tabs.selected==ind){
      this.tabs.selected = 0;
    }
    this.tabs.names.splice(ind, 1);
	this.ventas.splice(ind, 1);
	
	console.log(this.tabs);
	console.log(this.ventas);
  }
  
  newVenta(){
    this.tabs.names.push('VENTA '+(this.tabs.names.length+1));
	this.tabs.selected = (this.tabs.names.length-1);
	this.ventas.push({
      lineas: [],
      importe: 0
	} as Venta);
	
	console.log(this.tabs);
	console.log(this.ventas);
  }
}