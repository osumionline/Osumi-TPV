import { Component, OnInit, ViewChild } from '@angular/core';
import { Router }             from '@angular/router';
import { ApiService }         from '../../services/api.service';
import { DataShareService }   from '../../services/data-share.service';
import { VentasComponent }    from '../../components/ventas/ventas.component';
import { ArticulosComponent } from '../../components/articulos/articulos.component';
import { PedidosComponent }   from '../../components/pedidos/pedidos.component';

@Component({
  selector: 'otpv-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  @ViewChild('ventas',    {static: false}) ventasComponent:    VentasComponent;
  @ViewChild('articulos', {static: false}) articulosComponent: ArticulosComponent;
  @ViewChild('pedidos',   {static: false}) pedidosComponent:   PedidosComponent;
  
  loading: boolean = true;
  selectedOption: string = 'sales';
  isOpened: boolean = false;

  constructor(private as: ApiService, private router: Router, private dss: DataShareService) {}

  ngOnInit() {
    const d = new Date();
    const date = d.getFullYear() + '-' + (((d.getMonth()+1)<10) ? '0'+(d.getMonth()+1) : (d.getMonth()+1)) + '-' + ((d.getDate()<10) ? '0'+d.getDate() : d.getDate());
    this.as.checkStart(date).subscribe(result => {
      if (result.appData===null){
        this.router.navigate(['/installation']);
      }
      else{
        this.dss.setGlobal('appData', result.appData);
        this.isOpened = result.opened;
        this.articulosComponent.loadAppData(result.appData);
      }
      this.loading = false;
    });
  }
  
  openBox(){
    this.as.openBox().subscribe(result => {
      this.isOpened = true;
	  this.ventasComponent.startFocus();
    });
  }
  
  selectOptionSales(){
    this.selectOption('sales');
  }
  
  selectOptionItems(){
    this.articulosComponent.newArticulo();
    this.selectOption('items');
  }
  
  selectOptionOrders(){
    this.selectOption('orders');
  }
  
  selectOption(option: string){
    this.selectedOption = option;
  }
}