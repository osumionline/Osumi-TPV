import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Venta, LineaVenta } from '../../interfaces/interfaces';
import { ApiService }        from '../../services/api.service';
import { CommonService }     from '../../services/common.service';
import { DialogService }     from '../../services/dialog.service';

@Component({
  selector: 'otpv-una-venta',
  templateUrl: './una-venta.component.html',
  styleUrls: ['./una-venta.component.css']
})
export class UnaVentaComponent {
  @Input() venta: Venta = {
    lineas: [],
    importe: 0
  };
  @Output() deleteVentaLineaEvent = new EventEmitter<number>();

  constructor(private as: ApiService, private cs: CommonService, private dialog: DialogService) {}
  
  addLineaVenta() {
    this.venta.lineas.push({
      idArticulo: null,
      localizador: null,
      descripcion: null,
      stock: null,
      cantidad: null,
      pvp: null,
      importe: null
	} as LineaVenta);
	setTimeout(() => {
	  this.setFocus();
	}, 200);
  }
  
  setFocus() {
    const loc: HTMLInputElement = document.getElementById('loc-new') as HTMLInputElement
    loc.focus();
  }
  
  checkLocalizador(ev, ind) {
    if (ev.keyCode==13){
      this.as.loadArticulo(this.venta.lineas[ind].localizador).subscribe(result => {
        this.venta.lineas[ind].localizador = result.articulo.localizador;
        this.venta.lineas[ind].idArticulo = result.articulo.id;
        this.venta.lineas[ind].descripcion = this.cs.urldecode(result.articulo.nombre);
        this.venta.lineas[ind].stock = result.articulo.stock;
        this.venta.lineas[ind].cantidad = 1;
        this.venta.lineas[ind].pvp = result.articulo.pvp;
        this.venta.lineas[ind].importe = result.articulo.pvp;
		
		this.addLineaVenta();
      });
    }
  }
  
  goToArticulos(loc) {
    console.log(loc);
  }
  
  borraLinea(ind: number) {
    this.dialog.confirm({title: '¡Atención!', content: '¿Está seguro de querer borrar esta línea?', ok: 'Confirmar', cancel: 'Cancelar'}).subscribe(result => {
      if (result===true){
        this.deleteVentaLineaEvent.emit(ind);
      }
	});
  }
}