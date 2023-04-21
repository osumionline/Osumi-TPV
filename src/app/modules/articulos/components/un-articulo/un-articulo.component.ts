import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { Router } from "@angular/router";
import { QRCodeModule } from "angularx-qrcode";
import {
  ArticuloResult,
  ArticuloSaveResult,
  CategoriasResult,
  ChartDataInterface,
  ChartResultInterface,
  ChartSelectInterface,
  HistoricoArticuloResult,
} from "src/app/interfaces/articulo.interface";
import { Month } from "src/app/interfaces/interfaces";
import {
  AccesosDirectosModal,
  BuscadorModal,
  DarDeBajaModal,
  MargenesModal,
  Modal,
} from "src/app/interfaces/modals.interface";
import { Articulo } from "src/app/model/articulos/articulo.model";
import { Categoria } from "src/app/model/articulos/categoria.model";
import { CodigoBarras } from "src/app/model/articulos/codigo-barras.model";
import { Foto } from "src/app/model/articulos/foto.model";
import { HistoricoArticulo } from "src/app/model/articulos/historico-articulo.model";
import { Marca } from "src/app/model/marcas/marca.model";
import { Proveedor } from "src/app/model/proveedores/proveedor.model";
import { IVAOption } from "src/app/model/tpv/iva-option.model";
import { AccesosDirectosModalComponent } from "src/app/modules/articulos/components/modals/accesos-directos-modal/accesos-directos-modal.component";
import { ArticuloDarDeBajaModalComponent } from "src/app/modules/articulos/components/modals/articulo-dar-de-baja-modal/articulo-dar-de-baja-modal.component";
import { MargenesModalComponent } from "src/app/modules/articulos/components/modals/margenes-modal/margenes-modal.component";
import { NewMarcaModalComponent } from "src/app/modules/articulos/components/modals/new-marca-modal/new-marca-modal.component";
import { MaterialModule } from "src/app/modules/material/material.module";
import { BuscadorModalComponent } from "src/app/modules/shared/components/modals/buscador-modal/buscador-modal.component";
import { NewProveedorModalComponent } from "src/app/modules/shared/components/modals/new-proveedor-modal/new-proveedor-modal.component";
import { CustomPaginatorIntl } from "src/app/modules/shared/custom-paginator-intl.class";
import { FixedNumberPipe } from "src/app/modules/shared/pipes/fixed-number.pipe";
import { Utils } from "src/app/modules/shared/utils.class";
import { AlmacenService } from "src/app/services/almacen.service";
import { ArticulosService } from "src/app/services/articulos.service";
import { CategoriasService } from "src/app/services/categorias.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ConfigService } from "src/app/services/config.service";
import { DialogService } from "src/app/services/dialog.service";
import { MarcasService } from "src/app/services/marcas.service";
import { OverlayService } from "src/app/services/overlay.service";
import { ProveedoresService } from "src/app/services/proveedores.service";
import { VentasService } from "src/app/services/ventas.service";

@Component({
  standalone: true,
  selector: "otpv-un-articulo",
  templateUrl: "./un-articulo.component.html",
  styleUrls: ["./un-articulo.component.scss"],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    QRCodeModule,
    FixedNumberPipe,
  ],
})
export class UnArticuloComponent implements OnInit, AfterViewInit, OnDestroy {
  _articulo: Articulo = null;
  @Input() set articulo(a: Articulo) {
    this._articulo = a === null ? new Articulo() : a;
    this.loadArticuloObj();
  }
  get articulo(): Articulo {
    return this._articulo;
  }
  @Input() ind: number = -1;
  @Output() duplicarArticuloEvent: EventEmitter<Articulo> =
    new EventEmitter<Articulo>();
  @Output() cerrarArticuloEvent: EventEmitter<number> =
    new EventEmitter<number>();

  marca: Marca = new Marca();
  proveedor: Proveedor = new Proveedor();

  loading: boolean = false;
  selectedTab: number = -1;
  @ViewChild("localizadorBox", { static: true }) localizadorBox: ElementRef;
  mostrarWeb: boolean = false;
  marcas: Marca[] = [];
  tipoIva: string = "iva";
  ivaOptions: IVAOption[] = [];
  ivaList: number[] = [];
  reList: number[] = [];
  categoriesPlain: Categoria[] = [];
  mostrarCaducidad: boolean = false;
  fecCad: string = null;
  fecCadEdit: boolean = false;
  @ViewChild("fecCadValue", { static: true }) fecCadValue: ElementRef;
  monthList: Month[] = [];
  yearList: number[] = [];
  newCodBarras: string = null;
  @ViewChild("codigoBarrasBox", { static: true }) codigoBarrasBox: ElementRef;
  mostrarBuscador: boolean = false;

  marginList: number[] = [];

  statsVentas: ChartSelectInterface = {
    data: "ventas",
    type: "units",
    month: -1,
    year: -1,
  };
  statsVentasData: ChartDataInterface[] = [];
  statsWeb: ChartSelectInterface = {
    data: "web",
    type: "units",
    month: -1,
    year: -1,
  };
  statsYearList: number[] = [];
  statsWebData: ChartDataInterface[] = [];

  historicoArticulo: HistoricoArticulo[] = [];
  historicoArticuloPag: number = 0;
  historicoArticuloPags: number = 0;
  historicoArticuloNumRes: number = 20;

  historicoArticuloDisplayedColumns: string[] = [
    "createdAt",
    "tipo",
    "stockPrevio",
    "diferencia",
    "stockFinal",
    "puc",
    "pvp",
    "idVenta",
    "idPedido",
  ];
  historicoArticuloDataSource: MatTableDataSource<HistoricoArticulo> =
    new MatTableDataSource<HistoricoArticulo>();
  @ViewChild(MatSort) sort: MatSort;

  saving: boolean = false;

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    localizador: new FormControl(null),
    nombre: new FormControl(null, Validators.required),
    idMarca: new FormControl(null, Validators.required),
    iva: new FormControl(null, Validators.required),
    re: new FormControl(null),
    ventaOnline: new FormControl(false),
    palb: new FormControl(null),
    puc: new FormControl(null),
    margen: new FormControl(null),
    pvp: new FormControl(null),
    stock: new FormControl(null),
    stockMin: new FormControl(null),
    stockMax: new FormControl(null),
    loteOptimo: new FormControl(null),
    idProveedor: new FormControl(null),
    idCategoria: new FormControl(null),
    referencia: new FormControl(null),
    fechaCaducidad: new FormControl(null),
    mostrarEnWeb: new FormControl(false),
    descCorta: new FormControl(null),
    descripcion: new FormControl(null),
    observaciones: new FormControl(null),
    mostrarObsPedidos: new FormControl(false),
    mostrarObsVentas: new FormControl(false),
  });

  showBuscador: boolean = false;

  constructor(
    private router: Router,
    private dialog: DialogService,
    private config: ConfigService,
    private cms: ClassMapperService,
    public ms: MarcasService,
    public ps: ProveedoresService,
    private css: CategoriasService,
    private ars: ArticulosService,
    private vs: VentasService,
    private als: AlmacenService,
    private overlayService: OverlayService
  ) {}

  ngOnInit(): void {
    const d = new Date();
    for (let y: number = d.getFullYear(); y < d.getFullYear() + 5; y++) {
      this.yearList.push(y);
    }
    this.loadAppData();
  }

  ngAfterViewInit(): void {
    this.form.get("iva").valueChanges.subscribe((x: number): void => {
      this.updateIva(x.toString());
    });
    this.form.get("re").valueChanges.subscribe((x: number): void => {
      this.updateRe(x.toString());
    });
    this.historicoArticuloDataSource.sort = this.sort;
  }

  loadAppData(): void {
    this.tipoIva = this.config.tipoIva;
    this.ivaOptions = this.config.ivaOptions;
    for (let ivaOption of this.ivaOptions) {
      this.ivaList.push(ivaOption.iva);
      this.reList.push(ivaOption.re);
    }
    this.mostrarWeb = this.config.ventaOnline;
    this.mostrarCaducidad = this.config.fechaCad;
    this.monthList = this.config.monthList;
    this.marginList = this.config.marginList;

    this.loadCategorias();
    switch (this.articulo.status) {
      case "new":
        {
          this.newArticulo();
        }
        break;
      case "load":
        {
          this.form.get("localizador").setValue(this.articulo.localizador);
          this.loadArticulo();
        }
        break;
      case "loaded":
        {
          this.loadArticuloObj();
        }
        break;
    }
  }

  loadCategorias(): void {
    if (!this.css.loaded) {
      this.css.getCategorias().subscribe((result: CategoriasResult): void => {
        const list: Categoria[] = this.cms.getCategorias([result.list]);
        this.css.loadCategorias(list);

        this.categoriesPlain = this.css.categoriasPlain;
      });
    } else {
      this.categoriesPlain = this.css.categoriasPlain;
    }
  }

  showDetails(loc: number): void {
    this.articulo.localizador = loc;
    this.loadArticulo();
  }

  checkLocalizador(ev: KeyboardEvent): void {
    if (this.showBuscador) {
      return;
    }
    const letters = /^[a-zA-Z]{1}$/;
    if (ev.key.match(letters) && !ev.ctrlKey) {
      ev.preventDefault();

      this.showBuscador = true;
      const modalBuscadorData: BuscadorModal = {
        modalTitle: "Buscador",
        modalColor: "blue",
        css: "modal-wide",
        key: ev.key,
      };
      const dialog = this.overlayService.open(
        BuscadorModalComponent,
        modalBuscadorData
      );
      dialog.afterClosed$.subscribe((data): void => {
        this.showBuscador = false;
        if (data.data !== null) {
          this.form.get("localizador").setValue(data.data);
          this.loadArticulo();
        } else {
          this.localizadorBox.nativeElement.focus();
        }
      });

      return;
    }
    if (ev.key == "Enter") {
      ev.preventDefault();
      ev.stopPropagation();

      this.loadArticulo();
    }
  }

  loadArticulo(): void {
    this.loading = true;
    this.ars
      .loadArticulo(this.form.get("localizador").value)
      .subscribe((result: ArticuloResult): void => {
        if (result.status === "ok") {
          const tabName: string = this.articulo.tabName;
          this.articulo = this.cms.getArticulo(result.articulo);
          this.articulo.tabName = tabName;
        } else {
          this.dialog
            .alert({
              title: "Error",
              content:
                'No existe ningún artículo con el localizador "' +
                this.form.get("localizador").value +
                '".',
              ok: "Continuar",
            })
            .subscribe((result: boolean): void => {
              this.form.get("localizador").setValue(null);
              this.loading = false;
              setTimeout((): void => {
                this.localizadorBox.nativeElement.select();
              }, 200);
            });
        }
      });
  }

  loadArticuloObj(): void {
    if (this.articulo.fechaCaducidad) {
      this.loadFecCad();
    }

    if (this.articulo.id) {
      this.loadStatsVentas();
      this.loadStatsWeb();
      this.loadHistorico();
    }

    this.form.patchValue(this.articulo.toInterface(false));
    this.form.get("localizador").markAsPristine();
    this.form.get("palb").markAsPristine();
    this.form.get("puc").markAsPristine();
    this.form.get("pvp").markAsPristine();

    if (this.articulo.idMarca !== null) {
      const marca: Marca = this.ms.findById(this.articulo.idMarca);
      this.articulo.marca = marca.nombre;
    }

    this.selectedTab = 0;
    this.loading = false;
  }

  abrirAccesosDirectos(): void {
    const modalAccesosDirectosData: AccesosDirectosModal = {
      modalTitle: "Accesos directos",
      modalColor: "blue",
      idArticulo: this.articulo.id,
    };
    const dialog = this.overlayService.open(
      AccesosDirectosModalComponent,
      modalAccesosDirectosData
    );
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data !== null) {
        this.form.get("localizador").setValue(data.data);
        this.loadArticulo();
      }
      setTimeout((): void => {
        this.localizadorBox.nativeElement.focus();
      }, 0);
    });
  }

  checkArticulosTab(ev: MatTabChangeEvent): void {
    if (ev.index === 2) {
      setTimeout((): void => {
        this.codigoBarrasBox.nativeElement.focus();
      }, 0);
    }
  }

  loadFecCad(): void {
    const fecCad: string[] = this.articulo.fechaCaducidad.split("/");
    const mes: Month = this.config.monthList.find(
      (x: Month): boolean => x.id === parseInt(fecCad[0])
    );

    this.fecCad = mes.name + " 20" + fecCad[1];
    this.fecCadEdit = false;
  }

  loadStatsVentas(): void {
    this.ars
      .getStatistics(this.statsVentas)
      .subscribe((result: ChartResultInterface): void => {
        this.statsVentasData = result.data;
      });
  }

  loadStatsWeb(): void {
    this.ars
      .getStatistics(this.statsWeb)
      .subscribe((result: ChartResultInterface): void => {
        this.statsWebData = result.data;
      });
  }

  loadHistorico(): void {
    this.ars
      .getHistoricoArticulo(this.articulo.id, this.historicoArticuloPag)
      .subscribe((result: HistoricoArticuloResult): void => {
        this.historicoArticuloPags = result.pags;
        this.historicoArticulo = this.cms.getHistoricoArticulos(result.list);
        this.historicoArticuloDataSource.data = this.historicoArticulo;
        console.log(this.historicoArticulo);
      });
  }

  newArticulo(): void {
    const tabName: string = this.articulo.tabName;
    this.articulo = new Articulo();
    this.articulo.tabName = tabName;
    this.form.patchValue(this.articulo.toInterface(false));
    this.selectedTab = 0;
    setTimeout((): void => {
      this.localizadorBox.nativeElement.focus();
    }, 0);
  }

  newMarca(): void {
    const modalnewMarcaData: Modal = {
      modalTitle: "Nueva marca",
      modalColor: "blue",
    };
    const dialog = this.overlayService.open(
      NewMarcaModalComponent,
      modalnewMarcaData
    );
    dialog.afterClosed$.subscribe((data): void => {
      if (data !== null) {
        this.articulo.idMarca = data.data;
        this.form.get("idMarca").setValue(data.data);
      }
    });
  }

  openProveedor(): void {
    const modalnewProveedorData: Modal = {
      modalTitle: "Nuevo proveedor",
      modalColor: "blue",
    };
    const dialog = this.overlayService.open(
      NewProveedorModalComponent,
      modalnewProveedorData
    );
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data !== null) {
        this.articulo.idProveedor = data.data;
        this.form.get("idProveedor").setValue(data.data);
      }
    });
  }

  updateIva(ev: string): void {
    const ind: number = this.ivaList.findIndex(
      (x: number): boolean => x == parseInt(ev)
    );
    this.form.get("re").setValue(this.reList[ind], { emitEvent: false });

    const ivare: number =
      (this.form.get("iva").value !== null ? this.form.get("iva").value : 0) +
      (this.form.get("re").value !== null ? this.form.get("re").value : 0);
    const puc: number = this.form.get("palb").value * (1 + ivare / 100);
    this.updatePuc(puc);
  }

  updateRe(ev: string): void {
    const ind: number = this.reList.findIndex(
      (x: number): boolean => x == parseFloat(ev)
    );
    this.form.get("iva").setValue(this.ivaList[ind], { emitEvent: false });

    const ivare: number =
      (this.form.get("iva").value !== null ? this.form.get("iva").value : 0) +
      (this.form.get("re").value !== null ? this.form.get("re").value : 0);
    const puc: number = this.form.get("palb").value * (1 + ivare / 100);
    this.updatePuc(puc);
  }

  editFecCad(): void {
    this.fecCadEdit = true;
    setTimeout((): void => {
      if (this.articulo.fechaCaducidad) {
        this.fecCadValue.nativeElement.select();
      } else {
        this.fecCadValue.nativeElement.focus();
      }
    }, 200);
  }

  validateFecCad(): boolean {
    const fecCadFormat = /[0-9][0-9]\/[0-9][0-9]/;
    return this.articulo.fechaCaducidad.match(fecCadFormat) !== null;
  }

  checkFecCad(ev: KeyboardEvent, blur: boolean = false): void {
    if (ev.key == "Enter" || blur) {
      if (this.validateFecCad()) {
        const d = new Date();
        const checkFecCadStr: string[] =
          this.articulo.fechaCaducidad.split("/");
        const month = this.config.monthList.find(
          (x: Month): boolean => x.id === parseInt(checkFecCadStr[0])
        );
        const checkD = new Date(
          2000 + parseInt(checkFecCadStr[1]),
          parseInt(checkFecCadStr[0]) - 1,
          month.days,
          23,
          59,
          59
        );
        if (d.getTime() > checkD.getTime()) {
          this.dialog
            .alert({
              title: "Error",
              content:
                "La fecha introducida no puede ser inferior a la actual.",
              ok: "Continuar",
            })
            .subscribe((result: boolean): void => {
              setTimeout((): void => {
                this.fecCadValue.nativeElement.select();
              }, 200);
            });
          return;
        } else {
          this.loadFecCad();
        }
      } else {
        this.dialog
          .alert({
            title: "Error",
            content:
              'El formato de fecha introducido no es correcto: mm/aa, por ejemplo Mayo de 2023 sería "05/23".',
            ok: "Continuar",
          })
          .subscribe((result: boolean): void => {
            setTimeout((): void => {
              this.fecCadValue.nativeElement.select();
            }, 200);
          });
        return;
      }
    }
  }

  setTwoNumberDecimal(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    target.value =
      target.value != ""
        ? parseFloat(target.value.replace(",", ".")).toFixed(2)
        : "0.00";
  }

  updatePalb(): void {
    this.form.get("palb").markAsDirty();

    const ivare: number =
      (this.form.get("iva").value !== null ? this.form.get("iva").value : 0) +
      (this.form.get("re").value != -1 ? this.form.get("re").value : 0);
    const puc: number = Utils.getTwoNumberDecimal(
      this.form.get("palb").value * (1 + ivare / 100)
    );
    this.updatePuc(puc);
  }

  updatePuc(puc: number = null): void {
    if (puc !== null) {
      this.form.get("puc").setValue(puc);
    }
    this.form.get("puc").markAsDirty();

    this.updateMargen();
  }

  updateMargen(): void {
    if (
      this.form.get("puc").value !== null &&
      this.form.get("puc").value !== 0 &&
      this.form.get("pvp").value !== null &&
      this.form.get("pvp").value !== 0
    ) {
      this.articulo.margen =
        ((this.form.get("pvp").value - this.form.get("puc").value) /
          this.form.get("pvp").value) *
        100;
    } else {
      this.articulo.margen = 0;
    }
    this.form.get("margen").setValue(this.articulo.margen);
  }

  updatePvp(): void {
    this.form.get("pvp").markAsDirty();

    this.updateMargen();
  }

  preventCodBarras(ev: KeyboardEvent): void {
    if (ev) {
      if (ev.key === "Enter") {
        ev.preventDefault();
      }
    }
  }

  fixCodBarras(ev: KeyboardEvent = null): void {
    if (ev) {
      if (ev.key === "Enter") {
        this.addNewCodBarras();
      }
    } else {
      this.addNewCodBarras();
    }
  }

  addNewCodBarras(): void {
    if (this.newCodBarras) {
      const cb: CodigoBarras = new CodigoBarras(null, this.newCodBarras, false);

      this.articulo.codigosBarras.push(cb);
      this.newCodBarras = null;
    }
  }

  deleteCodBarras(codBarras: CodigoBarras): void {
    const ind: number = this.articulo.codigosBarras.findIndex(
      (x: CodigoBarras): boolean => x.codigoBarras == codBarras.codigoBarras
    );
    this.articulo.codigosBarras.splice(ind, 1);
  }

  addFoto(): void {
    document.getElementById("foto-file").click();
  }

  onFotoChange(ev: Event): void {
    let reader: FileReader = new FileReader();
    if (
      (<HTMLInputElement>ev.target).files &&
      (<HTMLInputElement>ev.target).files.length > 0
    ) {
      let file = (<HTMLInputElement>ev.target).files[0];
      reader.readAsDataURL(file);
      reader.onload = (): void => {
        const foto: Foto = new Foto();
        foto.load(reader.result as string);
        this.articulo.fotosList.push(foto);
        (<HTMLInputElement>document.getElementById("foto-file")).value = "";
      };
    }
  }

  deleteFoto(i: number): void {
    this.dialog
      .confirm({
        title: "Confirmar",
        content: "¿Estás seguro de querer borrar esta foto?",
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          if (this.articulo.fotosList[i].status === "ok") {
            this.articulo.fotosList[i].status = "deleted";
          }
          if (this.articulo.fotosList[i].status === "new") {
            this.articulo.fotosList.splice(i, 1);
          }
        }
      });
  }

  moveFoto(sent: string, i: number): void {
    let aux: Foto = null;
    if (sent === "left") {
      if (i === 0) {
        return;
      }
      aux = this.articulo.fotosList[i];
      this.articulo.fotosList[i] = this.articulo.fotosList[i - 1];
      this.articulo.fotosList[i - 1] = aux;
    } else {
      if (i === this.articulo.fotosList.length - 1) {
        return;
      }
      aux = this.articulo.fotosList[i];
      this.articulo.fotosList[i] = this.articulo.fotosList[i + 1];
      this.articulo.fotosList[i + 1] = aux;
    }
  }

  darDeBaja(): void {
    const modalDarDeBajaData: DarDeBajaModal = {
      modalTitle: "Confirmar",
      modalColor: "red",
      id: this.articulo.id,
      nombre: this.articulo.nombre,
    };
    const dialog = this.overlayService.open(
      ArticuloDarDeBajaModalComponent,
      modalDarDeBajaData
    );
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data === true) {
        this.newArticulo();
      }
    });
  }

  goToReturn(): void {
    switch (this.ars.returnInfo.where) {
      case "ventas":
        {
          this.vs.updateArticulo(this.articulo);
          this.router.navigate(["/ventas"]);
        }
        break;
      case "pedido":
        {
          this.ars.returnInfo.extra = this.articulo.localizador;
          this.router.navigate(["/compras/pedido/", this.ars.returnInfo.id]);
        }
        break;
      case "pedido-edit":
        {
          this.ars.returnInfo.extra = null;
          this.router.navigate(["/compras/pedido/", this.ars.returnInfo.id]);
        }
        break;
      case "almacen":
        {
          this.als.updateArticulo(this.articulo);
          this.router.navigate(["/almacen"]);
        }
        break;
    }
  }

  cancelar(): void {
    this.form.reset();
    this.form.patchValue(this.articulo.toInterface(false));
    this.form.get("localizador").markAsPristine();
    this.form.get("palb").markAsPristine();
    this.form.get("puc").markAsPristine();
    this.form.get("pvp").markAsPristine();

    if (this.ars.returnInfo !== null) {
      this.goToReturn();
    }
  }

  guardarYCerrar(): void {
    this.guardar(true);
  }

  guardar(cerrar: boolean = false): void {
    this.articulo.fromInterface(this.form.value, false);
    this.articulo.stock = this.articulo.stock || 0;
    this.articulo.stockMin = this.articulo.stockMin || 0;
    this.articulo.stockMax = this.articulo.stockMax || 0;
    this.articulo.loteOptimo = this.articulo.loteOptimo || 0;
    this.articulo.palb = this.articulo.palb || 0;
    this.articulo.puc = this.articulo.puc || 0;
    this.articulo.pvp = this.articulo.pvp || 0;
    this.articulo.margen = this.articulo.margen || 0;

    if (this.articulo.nombre === null || this.articulo.nombre === "") {
      this.dialog
        .alert({
          title: "Error",
          content: "¡No puedes dejar en blanco el nombre del artículo!",
          ok: "Continuar",
        })
        .subscribe((result: boolean): void => {});
      return;
    }

    if (!this.articulo.idMarca) {
      this.dialog
        .alert({
          title: "Error",
          content: "¡No has elegido la marca del artículo!",
          ok: "Continuar",
        })
        .subscribe((result: boolean): void => {});
      this.selectedTab = 0;
      return;
    }

    this.saving = true;
    this.ars
      .saveArticulo(this.articulo.toInterface())
      .subscribe((result: ArticuloSaveResult): void => {
        if (result.status === "ok") {
          this.articulo.localizador = result.localizador;
          this.form.get("localizador").setValue(result.localizador);
          this.dialog
            .alert({
              title: "Información",
              content: "El artículo ha sido guardado correctamente.",
              ok: "Continuar",
            })
            .subscribe((result: boolean): void => {
              this.saving = false;
              if (cerrar) {
                this.cerrarArticuloEvent.emit(this.ind);
              }
              if (this.ars.returnInfo === null) {
                this.articulo.nombreStatus = "ok";
                this.loadArticulo();
              } else {
                this.goToReturn();
              }
            });
        } else {
          this.saving = false;
          if (result.status === "nombre-used") {
            this.dialog
              .confirm({
                title: "Confirmar",
                content: `Ya existe un artículo con el nombre "${
                  this.articulo.nombre
                }" para la marca "${Utils.urldecode(
                  result.message
                )}" , ¿quieres continuar?`,
                ok: "Continuar",
                cancel: "Cancelar",
              })
              .subscribe((result: boolean): void => {
                if (result === true) {
                  this.articulo.nombreStatus = "checked";
                  this.guardar(cerrar);
                }
              });
          }
          if (result.status === "referencia-used") {
            this.dialog
              .alert({
                title: "Error",
                content: `La referencia "${
                  this.articulo.referencia
                }" ya está en uso por el artículo "${Utils.urldecode(
                  result.message
                )}".`,
                ok: "Continuar",
              })
              .subscribe((result: boolean): void => {
                this.selectedTab = 0;
              });
          }
          if (result.status === "cb-used") {
            const data: string[] = Utils.urldecode(result.message).split("/");
            this.dialog
              .alert({
                title: "Error",
                content: `El código de barras "${data[0]}" ya está en uso por el artículo "${data[1]}/${data[2]}".`,
                ok: "Continuar",
              })
              .subscribe((result: boolean): void => {
                this.selectedTab = 1;
              });
          }
        }
      });
  }

  abrirMargenes(): void {
    const modalMargenesData: MargenesModal = {
      modalTitle: "Márgenes",
      modalColor: "blue",
      puc: this.form.get("puc").value,
      list: this.marginList,
    };
    const dialog = this.overlayService.open(
      MargenesModalComponent,
      modalMargenesData
    );
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data !== null) {
        this.articulo.margen = data.data;
        this.articulo.pvp = Utils.getTwoNumberDecimal(
          (this.form.get("puc").value * 100) / (100 - data.data)
        );
        this.form.get("pvp").setValue(this.articulo.pvp);
        this.form.get("pvp").markAsDirty();
      }
    });
  }

  duplicar(): void {
    this.dialog
      .confirm({
        title: "Confirmar",
        content: "¿Quieres duplicar este artículo y crear uno nuevo?",
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.duplicarArticuloEvent.emit(this.articulo);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.ars.list[this.ind] !== undefined) {
      this.ars.list[this.ind] = this.articulo;
    }
  }
}
