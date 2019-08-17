import { Component, OnInit } from '@angular/core';
import {FormControl}         from '@angular/forms';
import { ApiService }        from '../../services/api.service';
import { DataShareService }  from '../../services/data-share.service';
import { AppData, Marca, Proveedor, Articulo, Categoria, CodigoBarras } from '../../interfaces/interfaces';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-articulos',
  templateUrl: './html/articulos.component.html',
  styleUrls: ['./css/articulos.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
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
    mostrarObsPedidos: false,
    mostrarObsVentas: false,
    referencia: null,
    ventaOnline: false,
    mostrarEnWeb: false,
    idCategoria: null,
    descCorta: '',
    desc: null,
    codigosBarras: []
  } as Articulo;
  mostrarWeb: boolean = false;
  marcas: Marca[] = [];
  proveedores: Proveedor[] = [];
  ivaLabel: string = 'IVA';
  ivaList: number[] = [];
  categoriesPlain = [];
  date = new FormControl(moment());

  constructor(private as: ApiService, private dss: DataShareService) {}

  ngOnInit() {
    for (let i=0; i<10; i++){
      this.articulo.codigosBarras.push({
        id: null,
        codigoBarras: null,
        porDefecto: false,
        fixed: false
      } as CodigoBarras);
    }
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
    for (let cat of catList){
      this.categoriesPlain.push({id: cat.id, nombre: cat.nombre, profundidad: cat.profundidad});
      this.loadCategoriesPlain(cat.hijos);
    }
  }
  
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }
  
  fixCodBarras(codBarras: CodigoBarras, ev){
    if (ev.keyCode==13){
      codBarras.fixed = true;
    }
  }
  
  deleteCodBarras(codBarras: CodigoBarras){
    let ind = this.articulo.codigosBarras.findIndex(x => x.codigoBarras = codBarras.codigoBarras);
    let newCodBarras = {
      id: null,
      codigoBarras: null,
      porDefecto: false,
      fixed: false
    } as CodigoBarras;
    this.articulo.codigosBarras[ind] = newCodBarras;
  }
  
  darDeBaja(){
    
  }
}