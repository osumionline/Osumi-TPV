import { Component, OnInit } from '@angular/core';
import { ApiService }        from '../../services/api.service';
import { DataShareService }  from '../../services/data-share.service';
import { AppData, Marca, Proveedor, Articulo, Categoria } from '../../interfaces/interfaces';

@Component({
  selector: 'app-articulos',
  templateUrl: './html/articulos.component.html',
  styleUrls: ['./css/articulos.component.css']
})
export class ArticulosComponent implements OnInit {
  articulo = {
    id: null,
    localizador: null,
    nombre: 'Nuevo artículo',
    puc: 0,
    pvp: 0,
    margen: 0,
    idMarca: null,
    idProveedor: null,
    stock: 0,
    stockMin: 0,
    stockMax: 0,
    loteOptimo: 0,
    iva: null,
    fechaCaducidad: null,
    mostrarFecCad: false,
    observaciones: null,
    mostrarObservaciones: false,
    referencia: null,
    ventaOnline: false,
    idCategoria: null,
    descCorta: null,
    desc: null
  } as Articulo;
  mostrarWeb: boolean = false;
  marcas: Marca[] = [];
  proveedores: Proveedor[] = [];
  ivaLabel: string = 'IVA';
  ivaList: number[] = [];
  categoriesPlain = [];

  constructor(private as: ApiService, private dss: DataShareService) {}

  ngOnInit() {}
  
  loadAppData(appData: AppData){
    this.mostrarWeb = appData.ventaOnline;
    if (appData.tipoIva=='iva'){
      this.ivaLabel = 'IVA';
    }
    else{
      this.ivaLabel = 'Recargo de equivalencia';
    }
    this.ivaList = appData.ivaList;
    
    this.loadData();
  }
  
  loadData(){
    const marcasList = this.dss.getGlobal('marcas');
    if (marcasList){
      this.marcas = marcasList;
    }
    else{
      this.as.getMarcas().subscribe(result => {
        this.marcas = result.list;
        this.dss.setGlobal('marcas', result.list);
      });
    }
    const proveedoresList = this.dss.getGlobal('proveedores');
    if (proveedoresList){
      this.proveedores = proveedoresList;
    }
    else{
      this.as.getProveedores().subscribe(result => {
        this.proveedores = result.list;
        this.dss.setGlobal('proveedores', result.list);
      });
    }
    this.as.getCategorias().subscribe(result => {
      this.loadCategoriesPlain([result.list]);
    });
  }
  
  loadCategoriesPlain(catList:Categoria[]=null){
    console.log(catList);
    for (let cat of catList){
      this.categoriesPlain.push({id: cat.id, nombre: cat.nombre, profundidad: cat.profundidad});
      this.loadCategoriesPlain(cat.hijos);
    }
  }
}