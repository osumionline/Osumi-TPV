import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Venta, LineaVenta } from '../../interfaces/interfaces';
import { ApiService }        from '../../services/api.service';
import { CommonService }     from '../../services/common.service';

@Component({
  selector: 'otpv-una-venta',
  templateUrl: './una-venta.component.html',
  styleUrls: ['./una-venta.component.css']
})
export class UnaVentaComponent {
  @ViewChild('ventaLoc', {static: false}) ventaLoc: ElementRef;

  @Input() venta: Venta = {
    lineas: [],
    importe: 0
  };

  constructor(private as: ApiService, private cs: CommonService) {}
  
  addLineaVenta() {
    this.venta.lineas.push({
      localizador: null,
      descripcion: null,
      stock: null,
      cantidad: null,
      pvp: null,
      importe: null
	} as LineaVenta);
	setTimeout(() => {
      this.ventaLoc.nativeElement.focus();
	}, 200);
  }
  
  checkLocalizador(ev, ind) {
    if (ev.keyCode==13){
      this.as.loadArticulo(this.venta.lineas[ind].localizador).subscribe(result => {
        this.venta.lineas[ind].descripcion = this.cs.urldecode(result.articulo.nombre);
        this.venta.lineas[ind].stock = result.articulo.stock;
        this.venta.lineas[ind].cantidad = 1;
        this.venta.lineas[ind].pvp = result.articulo.pvp;
        this.venta.lineas[ind].importe = result.articulo.pvp;
		
		this.addLineaVenta();
      });
    }
  }
}