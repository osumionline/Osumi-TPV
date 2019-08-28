import { Component, OnInit } from '@angular/core';
import {FormControl}         from '@angular/forms';
import { ApiService }        from '../../services/api.service';
import { DataShareService }  from '../../services/data-share.service';
import { DialogService }     from '../../services/dialog.service';
import { CommonService }     from '../../services/common.service';
import { AppData, Marca, Proveedor, Articulo, Categoria, CodigoBarras, Month } from '../../interfaces/interfaces';
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
    palb: 0,
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
    codigosBarras: [],
    activo: true
  } as Articulo;

  marca = {
    id: null,
    nombre: null,
    telefono: null,
    email: null,
    web: null,
    observaciones: null
  } as Marca;

  proveedor = {
    id: null,
    nombre: null,
    direccion: null,
    telefono: null,
    email: null,
    web: null,
    observaciones: null,
    marcas: []
  } as Proveedor;

  selectedTab: number = -1;
  mostrarWeb: boolean = false;
  marcas: Marca[] = [];
  nuevaMarca: boolean = false;
  proveedores: Proveedor[] = [];
  nuevoProveedor: boolean = false;
  ivaLabel: string = 'IVA';
  ivaList: number[] = [];
  categoriesPlain = [];
  fecCadMonth: number = null;
  fecCadYear: number = null;
  monthList: Month[] = [
    {id: 1, name: 'Enero'},
    {id: 2, name: 'Febrero'},
    {id: 3, name: 'Marzo'},
    {id: 4, name: 'Abril'},
    {id: 5, name: 'Mayo'},
    {id: 6, name: 'Junio'},
    {id: 7, name: 'Julio'},
    {id: 8, name: 'Agosto'},
    {id: 9, name: 'Septiembre'},
    {id: 10, name: 'Octubre'},
    {id: 11, name: 'Noviembre'},
    {id: 12, name: 'Diciembre'}
  ];
  yearList: number[] = [];
  confirmarDarDeBaja: boolean = false;
  darDeBajaLoading: boolean = false;

  constructor(private dialog: DialogService,
              private as: ApiService,
              private dss: DataShareService,
              private cs: CommonService) {}

  ngOnInit() {
    const d = new Date();
    for (let y = d.getFullYear(); y<(d.getFullYear()+5); y++){
      this.yearList.push(y);
    }
  }

  loadAppData(appData: AppData) {
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
  
  loadData() {
    this.loadMarcas();
    this.loadProveedores();
    this.loadCategorias();
    
    this.newArticulo();
  }

  loadMarcas() {
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
  }

  loadProveedores() {
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
  }

  loadCategorias() {
    this.as.getCategorias().subscribe(result => {
      this.loadCategoriesPlain([result.list]);
    });
  }

  loadCategoriesPlain(catList:Categoria[]=null) {
    for (let cat of catList){
      this.categoriesPlain.push({id: cat.id, nombre: cat.nombre, profundidad: cat.profundidad});
      this.loadCategoriesPlain(cat.hijos);
    }
  }

  loadCodigosBarras() {
    for (let i=0; i<5; i++){
      this.articulo.codigosBarras.push({
        id: null,
        codigoBarras: null,
        porDefecto: false,
        fixed: false
      } as CodigoBarras);
    }
  }
  
  checkLocalizador(ev) {
    if (ev.keyCode==13 && this.articulo.localizador.toString().length==6){
      this.loadArticulo();
    }
  }
  
  loadArticulo() {
    this.as.loadArticulo(this.articulo.localizador).subscribe(result => {
      console.log(result);
      
      this.articulo = {
        id: result.articulo.id,
        localizador: result.articulo.localizador,
        nombre: this.cs.urldecode(result.articulo.nombre),
        puc: result.articulo.puc,
        pvp: result.articulo.pvp,
        margen: result.articulo.margen,
        palb: result.articulo.palb,
        idMarca: result.articulo.idMarca,
        idProveedor: result.articulo.idProveedor,
        stock: result.articulo.stock,
        stockMin: result.articulo.stockMin,
        stockMax: result.articulo.stockMax,
        loteOptimo: result.articulo.loteOptimo,
        iva: result.articulo.iva,
        fechaCaducidad: result.articulo.fechaCaducidad,
        mostrarFecCad: result.articulo.mostrarFecCad,
        observaciones: this.cs.urldecode(result.articulo.observaciones),
        mostrarObsPedidos: result.articulo.mostrarObsPedidos,
        mostrarObsVentas: result.articulo.mostrarObsVentas,
        referencia: result.articulo.referencia,
        ventaOnline: result.articulo.ventaOnline,
        mostrarEnWeb: result.articulo.mostrarEnWeb,
        idCategoria: result.articulo.idCategoria,
        descCorta: result.articulo.descCorta,
        desc: result.articulo.desc,
        codigosBarras: [],
        activo: result.articulo.activo
      } as Articulo;
  
      this.loadCodigosBarras();
      for (let ind in result.articulo.codigosBarras){
        this.articulo.codigosBarras[ind] = result.articulo.codigosBarras[ind];
      }
      this.selectedTab = 0;
    });
  }

  newArticulo() {
    this.articulo = {
      id: null,
      localizador: null,
      nombre: 'Nuevo artículo',
      puc: 0,
      pvp: 0,
      margen: 0,
      palb: 0,
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
      codigosBarras: [],
      activo: true
    } as Articulo;

    this.loadCodigosBarras();
    this.selectedTab = 0;
  }
  
  newMarca() {
    this.marca = {
      id: null,
      nombre: null,
      telefono: null,
      email: null,
      web: null,
      observaciones: null
    } as Marca;
    
    this.nuevaMarca = true;
  }
  
  newMarcaCerrar(ev=null) {
    if (ev){
      ev.preventDefault();
    }
    this.nuevaMarca = false;
  }
  
  guardarMarca() {
    if (!this.marca.nombre){
      this.dialog.alert({title: 'Error', content: '¡No puedes dejar el nombre de la marca en blanco!', ok: 'Continuar'}).subscribe(result => {});
      return false;
    }
    
    this.as.saveMarca(this.marca).subscribe(result => {
      if (result.status=='ok'){
        this.articulo.idMarca = result.id;
        this.dss.removeGlobal('marcas');
        this.loadMarcas();
        this.newMarcaCerrar();
      }
      else{
        this.dialog.alert({title: 'Error', content: 'Ocurrió un error al guardar la nueva marca', ok: 'Continuar'}).subscribe(result => {});
        return false;
      }
    });
  }
  
  newProveedor() {
    this.proveedor = {
      id: null,
      nombre: null,
      direccion: null,
      telefono: null,
      email: null,
      web: null,
      observaciones: null,
      marcas: []
    } as Proveedor;
    
    this.nuevoProveedor = true;
  }
  
  newProveedorCerrar(ev=null) {
    if (ev){
      ev.preventDefault();
    }
    this.nuevoProveedor = false;
  }
  
  addMarcaToProveedor(marca: Marca, ev) {
    let ind = this.proveedor.marcas.findIndex(x => x==marca.id);

    if (ev.checked){
      if (ind==-1){
        this.proveedor.marcas.push(marca.id);
      }
    }
    else{
      if (ind!=-1){
        this.proveedor.marcas.splice(ind, 1);
      }
    }
  }
  
  guardarProveedor() {
    if (!this.proveedor.nombre){
      this.dialog.alert({title: 'Error', content: '¡No puedes dejar el nombre del proveedor en blanco!', ok: 'Continuar'}).subscribe(result => {});
      return false;
    }
    
    if (this.proveedor.marcas.length==0){
      this.dialog.confirm({title: 'Confirmar', content: 'No has elegido ninguna marca para el proveedor, ¿quieres continuar?', ok: 'Continuar', cancel: 'Cancelar'}).subscribe(result => {
        if (result===true){
          this.guardarProveedorContinue();
        }
      });
    }
    else{
      this.guardarProveedorContinue();
    }
  }
  
  guardarProveedorContinue() {
    this.as.saveProveedor(this.proveedor).subscribe(result => {
      if (result.status=='ok'){
        this.articulo.idProveedor = result.id;
        this.dss.removeGlobal('proveedores');
        this.loadProveedores();
        this.newProveedorCerrar();
      }
      else{
        this.dialog.alert({title: 'Error', content: 'Ocurrió un error al guardar el nuevo proveedor', ok: 'Continuar'}).subscribe(result => {});
        return false;
      }
    });
  }
  
  updateFecCaducidad(){
    this.fecCadMonth = null;
    this.fecCadYear = null;
  }
  
  setTwoNumberDecimal($event) {
    $event.target.value = ($event.target.value!='') ? parseFloat($event.target.value).toFixed(2) : '0.00';
  }
  
  fixCodBarras(codBarras: CodigoBarras, ev) {
    if (ev.keyCode==13){
      codBarras.fixed = true;
    }
  }
  
  deleteCodBarras(codBarras: CodigoBarras) {
    let ind = this.articulo.codigosBarras.findIndex(x => x.codigoBarras == codBarras.codigoBarras);
    let newCodBarras = {
      id: null,
      codigoBarras: null,
      porDefecto: false,
      fixed: false
    } as CodigoBarras;
    this.articulo.codigosBarras[ind] = newCodBarras;
  }

  darDeBaja() {
    this.confirmarDarDeBaja = true;
  }

  darDeBajaCerrar(ev) {
    ev.preventDefault();
    this.confirmarDarDeBaja = false;
  }

  darDeBajaOk() {
    this.darDeBajaLoading = true;
    this.as.disableProduct(this.articulo.id).subscribe(response => {
      if (response.status=='ok'){
        this.dialog.alert({title: 'Éxito', content: 'El artículo "'+this.articulo.nombre+'" ha sido dado de baja.', ok: 'Continuar'}).subscribe(result => {
          this.newArticulo();
        });
      }
      else{
        this.dialog.alert({title: 'Error', content: '¡Ocurrió un error al dar de baja el artículo!', ok: 'Continuar'}).subscribe(result => {});
      }
    });
  }
  
  cancelar() {
    
  }
  
  guardar() {
    this.articulo.stock      = this.articulo.stock      || 0;
    this.articulo.stockMin   = this.articulo.stockMin   || 0;
    this.articulo.stockMax   = this.articulo.stockMax   || 0;
    this.articulo.loteOptimo = this.articulo.loteOptimo || 0;

    if (!this.articulo.idMarca){
      this.dialog.alert({title: 'Error', content: '¡No has elegido la marca del artículo!', ok: 'Continuar'}).subscribe(result => {});
      this.selectedTab = 0;
      return false;
    }

    if (!this.articulo.iva){
      this.dialog.alert({title: 'Error', content: '¡No has elegido IVA para el artículo!', ok: 'Continuar'}).subscribe(result => {});
      this.selectedTab = 0;
      return false;
    }

    if (this.articulo.mostrarFecCad){
      if (!this.fecCadMonth){
        this.dialog.alert({title: 'Error', content: 'Has indicado que el artículo tiene fecha de caducidad, pero no has elegido el mes.', ok: 'Continuar'}).subscribe(result => {});
        this.selectedTab = 1;
        return false;
      }
      if (!this.fecCadYear){
        this.dialog.alert({title: 'Error', content: 'Has indicado que el artículo tiene fecha de caducidad, pero no has elegido el año.', ok: 'Continuar'}).subscribe(result => {});
        this.selectedTab = 1;
        return false;
      }
      this.articulo.fechaCaducidad = ((this.fecCadMonth<10) ? '0'+this.fecCadMonth : this.fecCadMonth) + '/' + this.fecCadYear;
    }

    this.as.saveArticulo(this.articulo).subscribe(result => {
      this.articulo.localizador = result.localizador;
      this.dialog.alert({title: 'Información', content: 'El artículo ha sido guardado correctamente.', ok: 'Continuar'}).subscribe(result => {
        this.loadArticulo();
      });
    });
  }
}