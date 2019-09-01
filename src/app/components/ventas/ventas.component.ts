import { Component, OnInit } from '@angular/core';
import { Tabs } from '../../interfaces/interfaces';

@Component({
  selector: 'otpv-ventas',
  templateUrl: './html/ventas.component.html',
  styleUrls: ['./css/ventas.component.css']
})
export class VentasComponent implements OnInit {
  tabs = {
    selected: 0,
	names: ['VENTA 1', 'VENTA 2', 'VENTA 3', 'VENTA 4', 'VENTA 5']
  } as Tabs;

  constructor() {}
  ngOnInit() {}
}