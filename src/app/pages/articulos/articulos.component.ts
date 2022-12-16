import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { NewProveedorComponent } from "src/app/components/new-proveedor/new-proveedor.component";
import {
  ChartDataInterface,
  ChartSelectInterface,
} from "src/app/interfaces/articulo.interface";
import { Month } from "src/app/interfaces/interfaces";
import { AccesoDirecto } from "src/app/model/acceso-directo.model";
import { Articulo } from "src/app/model/articulo.model";
import { Categoria } from "src/app/model/categoria.model";
import { CodigoBarras } from "src/app/model/codigobarras.model";
import { Foto } from "src/app/model/foto.model";
import { IVAOption } from "src/app/model/iva-option.model";
import { Marca } from "src/app/model/marca.model";
import { Proveedor } from "src/app/model/proveedor.model";
import { ArticulosService } from "src/app/services/articulos.service";
import { CategoriasService } from "src/app/services/categorias.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ConfigService } from "src/app/services/config.service";
import { DialogService } from "src/app/services/dialog.service";
import { MarcasService } from "src/app/services/marcas.service";
import { ProveedoresService } from "src/app/services/proveedores.service";
import { VentasService } from "src/app/services/ventas.service";
import { Utils } from "src/app/shared/utils.class";

@Component({
  selector: "otpv-articulos",
  templateUrl: "./articulos.component.html",
  styleUrls: ["./articulos.component.scss"],
})
export class ArticulosComponent implements OnInit, AfterViewInit {
  articulo: Articulo = new Articulo();
  returnWhere: string = null;

  marca: Marca = new Marca();
  proveedor: Proveedor = new Proveedor();

  loading: boolean = false;
  selectedTab: number = -1;
  @ViewChild("localizadorBox", { static: true }) localizadorBox: ElementRef;
  showAccesosDirectos: boolean = false;
  accesosDirectosDisplayedColumns: string[] = ["accesoDirecto", "nombre", "id"];
  accesosDirectosList: AccesoDirecto[] = [];
  accesoDirecto: number = null;
  @ViewChild("acccesoDirectoBox", { static: true })
  acccesoDirectoBox: ElementRef;
  mostrarWeb: boolean = false;
  marcas: Marca[] = [];
  nuevaMarca: boolean = false;
  @ViewChild("newProveedor", { static: true })
  newProveedor: NewProveedorComponent;
  tipoIva: string = "iva";
  ivaOptions: IVAOption[] = [];
  selectedIvaOption: IVAOption = new IVAOption();
  categoriesPlain: Categoria[] = [];
  mostrarCaducidad: boolean = false;
  fecCad: string = null;
  fecCadEdit: boolean = false;
  @ViewChild("fecCadValue", { static: true }) fecCadValue: ElementRef;
  monthList: Month[] = [];
  yearList: number[] = [];
  newCodBarras: number = null;
  @ViewChild("codigoBarrasBox", { static: true }) codigoBarrasBox: ElementRef;
  confirmarDarDeBaja: boolean = false;
  darDeBajaLoading: boolean = false;
  mostrarBuscador: boolean = false;

  searchTimer: number = null;
  searching: boolean = false;
  searchName: string = "";
  @ViewChild("searchBoxName", { static: true }) searchBoxName: ElementRef;
  searchMarca: number = -1;
  searchResult: Articulo[] = [];
  buscadorDisplayedColumns: string[] = ["nombre", "marca", "stock"];
  buscadorDataSource: MatTableDataSource<Articulo> =
    new MatTableDataSource<Articulo>();

  mostrarMargenes: boolean = false;
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

  saving: boolean = false;

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    localizador: new FormControl(null),
    nombre: new FormControl(null, Validators.required),
    idMarca: new FormControl(null, Validators.required),
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

  accesosDirectosDataSource: MatTableDataSource<AccesoDirecto> =
    new MatTableDataSource<AccesoDirecto>();
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: DialogService,
    private config: ConfigService,
    private cms: ClassMapperService,
    public ms: MarcasService,
    public ps: ProveedoresService,
    private css: CategoriasService,
    private ars: ArticulosService,
    private vs: VentasService
  ) {}

  ngOnInit(): void {
    this.config.start().then((status) => {
      if (status === "install") {
        this.router.navigate(["/installation"]);
        return;
      }
      if (status === "loaded") {
        if (!this.config.isOpened) {
          this.router.navigate(["/"]);
          return;
        }
      }
    });
    const d = new Date();
    for (let y: number = d.getFullYear(); y < d.getFullYear() + 5; y++) {
      this.yearList.push(y);
    }
    this.loadAppData();
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.localizador) {
        this.articulo.localizador = params.localizador;
        this.form.get("localizador").setValue(params.localizador);
        this.loadArticulo();
      }
      if (params.where) {
        this.returnWhere = params.where;
      }
    });
  }

  ngAfterViewInit(): void {
    this.accesosDirectosDataSource.sort = this.sort;
    this.buscadorDataSource.sort = this.sort;
    this.form.get("palb").valueChanges.subscribe((x) => {
      this.updatePalb(x);
    });
    this.form.get("puc").valueChanges.subscribe((x) => {
      this.updatePuc(x);
    });
    this.form.get("pvp").valueChanges.subscribe((x) => {
      this.updatePvp(x);
    });
  }

  @HostListener("window:keydown", ["$event"])
  onKeyDown(ev: KeyboardEvent) {
    if (ev.key === "Escape") {
      if (this.showAccesosDirectos) {
        this.accesosDirectosCerrar();
      }
      if (this.nuevaMarca) {
        this.newMarcaCerrar();
      }
      if (this.mostrarBuscador) {
        this.cerrarBuscador();
      }
      if (this.mostrarMargenes) {
        this.cerrarMargenes();
      }
    }
  }

  loadAppData(): void {
    this.tipoIva = this.config.tipoIva;
    this.ivaOptions = this.config.ivaOptions;
    this.selectedIvaOption = new IVAOption(this.tipoIva);
    this.mostrarWeb = this.config.ventaOnline;
    this.mostrarCaducidad = this.config.fechaCad;
    this.monthList = this.config.monthList;
    this.marginList = this.config.marginList;

    this.loadData();
  }

  loadData(): void {
    this.loadCategorias();
    this.newArticulo();
  }

  loadCategorias(): void {
    this.css.getCategorias().subscribe((result) => {
      const list: Categoria[] = this.cms.getCategorias([result.list]);
      this.css.loadCategorias(list);

      this.categoriesPlain = this.css.categoriasPlain;
    });
  }

  showDetails(loc: number): void {
    this.articulo.localizador = loc;
    this.loadArticulo();
  }

  checkLocalizador(ev: KeyboardEvent): void {
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
      .subscribe((result) => {
        this.articulo = this.cms.getArticulo(result.articulo);
        if (this.articulo.fechaCaducidad) {
          this.loadFecCad();
        }

        this.selectedIvaOption = new IVAOption(
          this.tipoIva,
          this.articulo.iva,
          this.articulo.re
        );
        this.loadStatsVentas();
        this.loadStatsWeb();

        this.form.patchValue(this.articulo.toInterface(false));
        this.form.get("localizador").markAsPristine();
        this.form.get("palb").markAsPristine();
        this.form.get("puc").markAsPristine();
        this.form.get("pvp").markAsPristine();

        this.selectedTab = 0;
        this.loading = false;
      });
  }

  abrirAccesosDirectos(): void {
    this.ars.getAccesosDirectosList().subscribe((result) => {
      this.accesosDirectosList = this.cms.getAccesosDirectos(result.list);
      this.accesosDirectosDataSource.data = this.accesosDirectosList;
      this.showAccesosDirectos = true;
      this.accesoDirecto = null;
      setTimeout(() => {
        this.acccesoDirectoBox.nativeElement.focus();
      }, 0);
    });
  }

  accesosDirectosCerrar(ev: MouseEvent = null): void {
    ev && ev.preventDefault();
    this.showAccesosDirectos = false;
    setTimeout(() => {
      this.localizadorBox.nativeElement.focus();
    }, 0);
  }

  selectAccesoDirecto(row: AccesoDirecto): void {
    this.form.get("localizador").setValue(row.id);
    this.loadArticulo();
    this.accesosDirectosCerrar();
  }

  borrarAccesoDirecto(ev: MouseEvent, id: number): void {
    ev.preventDefault();
    ev.stopPropagation();

    this.dialog
      .confirm({
        title: "Confirmar",
        content: "¿Estás seguro de querer borrar este acceso directo?",
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result) => {
        if (result === true) {
          this.borrarAccesoDirectoConfirm(id);
        }
      });
  }

  borrarAccesoDirectoConfirm(id: number): void {
    this.ars.deleteAccesoDirecto(id).subscribe((result) => {
      this.abrirAccesosDirectos();
    });
  }

  asignarAccesoDirecto(): void {
    const ind: number = this.accesosDirectosList.findIndex(
      (x: AccesoDirecto): boolean => x.accesoDirecto === this.accesoDirecto
    );
    if (ind != -1) {
      this.dialog
        .alert({
          title: "Error",
          content:
            "El acceso directo que estás intentando asignar ya está en uso.",
          ok: "Continuar",
        })
        .subscribe((result) => {
          setTimeout(() => {
            this.acccesoDirectoBox.nativeElement.focus();
          }, 0);
        });
      return;
    }

    this.ars
      .asignarAccesoDirecto(this.articulo.id, this.accesoDirecto)
      .subscribe((result) => {
        this.dialog
          .alert({
            title: "OK",
            content: "El acceso directo ha sido asignado.",
            ok: "Continuar",
          })
          .subscribe((result) => {
            this.abrirAccesosDirectos();
          });
      });
  }

  checkArticulosTab(ev: MatTabChangeEvent): void {
    if (ev.index === 2) {
      setTimeout(() => {
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
    this.ars.getStatistics(this.statsVentas).subscribe((result) => {
      this.statsVentasData = result.data;
    });
  }

  loadStatsWeb(): void {
    this.ars.getStatistics(this.statsWeb).subscribe((result) => {
      this.statsWebData = result.data;
    });
  }

  newArticulo(): void {
    this.articulo = new Articulo();
    this.form.patchValue(this.articulo.toInterface(false));
    this.selectedTab = 0;
    setTimeout(() => {
      this.localizadorBox.nativeElement.focus();
    }, 0);
  }

  newMarca(): void {
    this.marca = new Marca();
    this.nuevaMarca = true;
  }

  newMarcaCerrar(ev: MouseEvent = null): void {
    ev && ev.preventDefault();
    this.nuevaMarca = false;
  }

  guardarMarca(): void {
    if (!this.marca.nombre) {
      this.dialog
        .alert({
          title: "Error",
          content: "¡No puedes dejar el nombre de la marca en blanco!",
          ok: "Continuar",
        })
        .subscribe((result) => {});
      return;
    }

    this.ms.saveMarca(this.marca.toInterface()).subscribe((result) => {
      if (result.status == "ok") {
        this.articulo.idMarca = result.id;
        this.form.get("idMarca").setValue(result.id);
        this.ms.resetMarcas();
        this.newMarcaCerrar();
      } else {
        this.dialog
          .alert({
            title: "Error",
            content: "Ocurrió un error al guardar la nueva marca",
            ok: "Continuar",
          })
          .subscribe((result) => {});
        return;
      }
    });
  }

  openProveedor(): void {
    this.newProveedor.newProveedor();
  }

  proveedorGuardado(id: number): void {
    this.articulo.idProveedor = id;
    this.form.get("idProveedor").setValue(id);
  }

  updateIvaRe(ev: string): void {
    const ivaInd: number = this.config.ivaOptions.findIndex(
      (x: IVAOption): boolean => x.id == ev
    );
    this.selectedIvaOption.updateValues(
      this.config.ivaOptions[ivaInd].iva,
      this.config.ivaOptions[ivaInd].re
    );

    const ivare: number =
      (this.selectedIvaOption.iva != -1 ? this.selectedIvaOption.iva : 0) +
      (this.selectedIvaOption.re != -1 ? this.selectedIvaOption.re : 0);
    const puc: number = this.getTwoNumberDecimal(
      this.form.get("palb").value * (1 + ivare / 100)
    );
    this.updatePuc(puc);
  }

  editFecCad(): void {
    this.fecCadEdit = true;
    setTimeout(() => {
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
            .subscribe((result) => {
              setTimeout(() => {
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
          .subscribe((result) => {
            setTimeout(() => {
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
      target.value != "" ? parseFloat(target.value).toFixed(2) : "0.00";
  }

  getTwoNumberDecimal(value: number): number {
    return Math.floor(value * 100) / 100;
  }

  updatePalb(ev: number): void {
    this.form.get("palb").setValue(ev, { emitEvent: false });
    this.form.get("palb").markAsDirty();

    let ivare: number = 0;
    if (this.selectedIvaOption.id !== null) {
      ivare =
        (this.selectedIvaOption.iva != -1 ? this.selectedIvaOption.iva : 0) +
        (this.selectedIvaOption.re != -1 ? this.selectedIvaOption.re : 0);
    }
    const puc: number = ev * (1 + ivare / 100);
    this.updatePuc(this.getTwoNumberDecimal(puc));
  }

  updatePuc(ev: number): void {
    this.form.get("puc").setValue(ev, { emitEvent: false });
    this.form.get("puc").markAsDirty();

    this.updateMargen(this.form.get("pvp").value, ev);
  }

  updateMargen(pvp: number, puc: number): void {
    if (this.form.get("puc").value !== 0) {
      this.articulo.margen = (pvp * 100) / puc - 100;
    } else {
      this.articulo.margen = 0;
    }
    this.form
      .get("margen")
      .setValue(this.articulo.margen, { emitEvent: false });
  }

  updatePvp(ev: number): void {
    this.form.get("pvp").setValue(ev, { emitEvent: false });
    this.form.get("pvp").markAsDirty();

    this.updateMargen(ev, this.form.get("puc").value);
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
      reader.onload = () => {
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
      .subscribe((result) => {
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
    this.confirmarDarDeBaja = true;
  }

  darDeBajaCerrar(ev: MouseEvent): void {
    ev.preventDefault();
    this.confirmarDarDeBaja = false;
  }

  darDeBajaOk(): void {
    this.darDeBajaLoading = true;
    this.ars.deleteArticulo(this.articulo.id).subscribe((response) => {
      if (response.status == "ok") {
        this.dialog
          .alert({
            title: "Éxito",
            content:
              'El artículo "' +
              this.articulo.nombre +
              '" ha sido dado de baja.',
            ok: "Continuar",
          })
          .subscribe((result) => {
            this.newArticulo();
          });
      } else {
        this.dialog
          .alert({
            title: "Error",
            content: "¡Ocurrió un error al dar de baja el artículo!",
            ok: "Continuar",
          })
          .subscribe((result) => {});
      }
    });
  }

  cancelar(): void {
    this.form.reset();
    this.form.patchValue(this.articulo.toInterface(false));
    this.form.get("localizador").markAsPristine();
    this.form.get("palb").markAsPristine();
    this.form.get("puc").markAsPristine();
    this.form.get("pvp").markAsPristine();
  }

  guardar(): void {
    this.articulo.fromInterface(this.form.value, false);
    this.articulo.stock = this.articulo.stock || 0;
    this.articulo.stockMin = this.articulo.stockMin || 0;
    this.articulo.stockMax = this.articulo.stockMax || 0;
    this.articulo.loteOptimo = this.articulo.loteOptimo || 0;

    if (this.articulo.nombre === null || this.articulo.nombre === "") {
      this.dialog
        .alert({
          title: "Error",
          content: "¡No puedes dejar en blanco el nombre del artículo!",
          ok: "Continuar",
        })
        .subscribe((result) => {});
      return;
    }

    if (!this.articulo.idMarca) {
      this.dialog
        .alert({
          title: "Error",
          content: "¡No has elegido la marca del artículo!",
          ok: "Continuar",
        })
        .subscribe((result) => {});
      this.selectedTab = 0;
      return;
    }

    if (this.selectedIvaOption.id === null) {
      this.dialog
        .alert({
          title: "Error",
          content: "¡No has elegido IVA para el artículo!",
          ok: "Continuar",
        })
        .subscribe((result) => {});
      this.selectedTab = 0;
      return;
    }
    const ivaInd: number = this.config.ivaOptions.findIndex(
      (x: IVAOption): boolean => x.id == this.selectedIvaOption.id
    );
    this.articulo.iva = this.config.ivaOptions[ivaInd].iva;
    this.articulo.re = this.config.ivaOptions[ivaInd].re;

    this.saving = true;
    this.ars.saveArticulo(this.articulo.toInterface()).subscribe((result) => {
      if (result.status === "ok") {
        this.articulo.localizador = result.localizador;
        this.dialog
          .alert({
            title: "Información",
            content: "El artículo ha sido guardado correctamente.",
            ok: "Continuar",
          })
          .subscribe((result) => {
            this.saving = false;
            this.vs.updateArticulo(this.articulo);
            if (this.returnWhere === null) {
              this.articulo.nombreStatus = "ok";
              this.loadArticulo();
            } else {
              this.router.navigate(["/ventas"]);
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
            .subscribe((result) => {
              if (result === true) {
                this.articulo.nombreStatus = "checked";
                this.guardar();
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
            .subscribe((result) => {
              this.selectedTab = 1;
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
            .subscribe((result) => {
              this.selectedTab = 2;
            });
        }
      }
    });
  }

  abrirBuscador(): void {
    this.searchName = "";
    this.searchMarca = -1;
    this.searchResult = [];
    this.buscadorDataSource.data = this.searchResult;
    this.mostrarBuscador = true;
    setTimeout(() => {
      this.searchBoxName.nativeElement.focus();
    }, 0);
  }

  cerrarBuscador(ev: MouseEvent = null): void {
    ev && ev.preventDefault();
    this.mostrarBuscador = false;
  }

  searchStart(): void {
    clearTimeout(this.searchTimer);
    this.searchTimer = window.setTimeout(() => {
      this.searchArticulos();
    }, 500);
  }

  searchArticulos(): void {
    if (this.searching) {
      return;
    }
    this.searchResult = [];
    this.buscadorDataSource.data = this.searchResult;
    if (
      (this.searchName === null || this.searchName === "") &&
      this.searchMarca === -1
    ) {
      return;
    }
    this.searching = true;
    this.ars
      .searchArticulos(this.searchName, this.searchMarca)
      .subscribe((result) => {
        this.searching = false;
        if (result.status === "ok") {
          const articulos: Articulo[] = this.cms.getArticulos(result.list);
          for (let articulo of articulos) {
            let marca: Marca = this.ms.findById(articulo.idMarca);
            articulo.marca = marca !== null ? marca.nombre : "";
            let proveedor = this.ps.findById(articulo.idProveedor);
            articulo.proveedor = proveedor !== null ? proveedor.nombre : "";
            this.searchResult.push(articulo);
            this.buscadorDataSource.data = this.searchResult;
          }
        } else {
          this.dialog
            .alert({
              title: "Error",
              content: "Ocurrió un error al buscar los artículos.",
              ok: "Continuar",
            })
            .subscribe((result) => {});
        }
      });
  }

  selectSearch(articulo: Articulo): void {
    this.articulo.localizador = articulo.localizador;
    this.form.get("localizador").setValue(this.articulo.localizador);
    this.loadArticulo();
    this.cerrarBuscador();
  }

  abrirMargenes(): void {
    this.mostrarMargenes = true;
  }

  cerrarMargenes(ev: MouseEvent = null): void {
    ev && ev.preventDefault();
    this.mostrarMargenes = false;
  }

  selectMargen(margen: number): void {
    this.articulo.margen = margen;
    this.articulo.pvp = this.getTwoNumberDecimal(
      this.articulo.puc * (1 + margen / 100)
    );
    this.form.get("pvp").setValue(this.articulo.pvp);
    this.form.get("pvp").markAsDirty();

    this.cerrarMargenes();
  }
}
