import { Component, OnInit } from '@angular/core';
import { AppData, Marca }    from '../../interfaces/interfaces';
import { ApiService }        from '../../services/api.service';
import { DataShareService }  from '../../services/data-share.service';

@Component({
  selector: 'app-articulos',
  templateUrl: './html/articulos.component.html',
  styleUrls: ['./css/articulos.component.css']
})
export class ArticulosComponent implements OnInit {
  mostrarWeb: boolean = false;
  marcas: Marca[] = [];
  ivaLabel: string = 'IVA';
  ivaList: number[] = [];

  constructor(private as: ApiService, private dss: DataShareService) {}

  ngOnInit() {
    const marcasList = this.dss.getGlobal('marcas');
    if (marcasList){
      this.marcas = marcasList;
    }
    this.as.getMarcas().subscribe(result => {
      this.marcas = result.list;
      this.dss.setGlobal('marcas', result.list);
    });
  }
  
  loadAppData(appData: AppData){
    this.mostrarWeb = appData.ventaOnline;
    if (appData.tipoIva=='iva'){
      this.ivaLabel = 'IVA';
    }
    else{
      this.ivaLabel = 'Recargo de equivalencia';
    }
    this.ivaList = appData.ivaList;
  }
}