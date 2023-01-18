import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { AccesosDirectosComponent } from "src/app/components/modals/accesos-directos/accesos-directos.component";
import { ArticuloDarDeBajaComponent } from "src/app/components/modals/articulo-dar-de-baja/articulo-dar-de-baja.component";
import { BuscadorComponent } from "src/app/components/modals/buscador/buscador.component";
import { MargenesComponent } from "src/app/components/modals/margenes/margenes.component";
import { NewMarcaComponent } from "src/app/components/modals/new-marca/new-marca.component";
import { NewProveedorComponent } from "src/app/components/modals/new-proveedor/new-proveedor.component";
import {
  ChartDataInterface,
  ChartSelectInterface,
} from "src/app/interfaces/articulo.interface";
import { Modal, Month } from "src/app/interfaces/interfaces";
import {
  AccesosDirectosModal,
  BuscadorModal,
  DarDeBajaModal,
  MargenesModal,
} from "src/app/interfaces/modals.interface";
import { Articulo } from "src/app/model/articulo.model";
import { Categoria } from "src/app/model/categoria.model";
import { CodigoBarras } from "src/app/model/codigo-barras.model";
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
import { OverlayService } from "src/app/services/overlay.service";
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
  returnWhereId: number = null;

  marca: Marca = new Marca();
  proveedor: Proveedor = new Proveedor();

  loading: boolean = false;
  selectedTab: number = -1;
  @ViewChild("localizadorBox", { static: true }) localizadorBox: ElementRef;
  mostrarWeb: boolean = false;
  marcas: Marca[] = [];
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
    private vs: VentasService,
    private overlayService: OverlayService
  ) {}

  ngOnInit(): void {
    const d = new Date();
    for (let y: number = d.getFullYear(); y < d.getFullYear() + 5; y++) {
      this.yearList.push(y);
    }
    this.loadAppData();
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.localizador && parseInt(params.localizador) !== 0) {
        this.articulo.localizador = params.localizador;
        this.form.get("localizador").setValue(params.localizador);
        this.loadArticulo();
      }
      if (params.where) {
        this.returnWhere = params.where;
      }
      if (params.id) {
        this.returnWhereId = params.id;
      }
    });
  }

  ngAfterViewInit(): void {
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
    const letters = /^[a-zA-Z]{1}$/;
    if (ev.key.match(letters)) {
      ev.preventDefault();

      const modalBuscadorData: BuscadorModal = {
        modalTitle: "Buscador",
        modalColor: "blue",
        key: ev.key,
      };
      const dialog = this.overlayService.open(
        BuscadorComponent,
        modalBuscadorData
      );
      dialog.afterClosed$.subscribe((data) => {
        if (data !== null) {
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
      .subscribe((result) => {
        if (result.status === "ok") {
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
            .subscribe((result) => {
              this.form.get("localizador").setValue(null);
              this.loading = false;
              setTimeout(() => {
                this.localizadorBox.nativeElement.select();
              }, 200);
            });
        }
      });
  }

  abrirAccesosDirectos(): void {
    const modalAccesosDirectosData: AccesosDirectosModal = {
      modalTitle: "Accesos directos",
      modalColor: "blue",
      idArticulo: this.articulo.id,
    };
    const dialog = this.overlayService.open(
      AccesosDirectosComponent,
      modalAccesosDirectosData
    );
    dialog.afterClosed$.subscribe((data) => {
      if (data.data !== null) {
        this.form.get("localizador").setValue(data.data);
        this.loadArticulo();
      }
      setTimeout(() => {
        this.localizadorBox.nativeElement.focus();
      }, 0);
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
    const modalnewMarcaData: Modal = {
      modalTitle: "Nueva marca",
      modalColor: "blue",
    };
    const dialog = this.overlayService.open(
      NewMarcaComponent,
      modalnewMarcaData,
      []
    );
    dialog.afterClosed$.subscribe((data) => {
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
      NewProveedorComponent,
      modalnewProveedorData,
      []
    );
    dialog.afterClosed$.subscribe((data) => {
      if (data !== null) {
        this.articulo.idProveedor = data.data;
        this.form.get("idProveedor").setValue(data.data);
      }
    });
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
    const modalDarDeBajaData: DarDeBajaModal = {
      modalTitle: "Confirmar",
      modalColor: "red",
      id: this.articulo.id,
      nombre: this.articulo.nombre,
    };
    const dialog = this.overlayService.open(
      ArticuloDarDeBajaComponent,
      modalDarDeBajaData,
      []
    );
    dialog.afterClosed$.subscribe((data) => {
      if (data.data === true) {
        this.newArticulo();
      }
    });
  }

  goToReturn(): void {
    switch (this.returnWhere) {
      case "ventas":
        {
          this.router.navigate(["/ventas"]);
        }
        break;
      case "pedido":
        {
          this.router.navigate(["/compras/pedido/", this.returnWhereId]);
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

    if (this.returnWhere !== null) {
      this.goToReturn();
    }
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

  abrirMargenes(): void {
    const modalMargenesData: MargenesModal = {
      modalTitle: "Márgenes",
      modalColor: "blue",
      puc: this.articulo.puc,
      list: this.marginList,
    };
    const dialog = this.overlayService.open(
      MargenesComponent,
      modalMargenesData
    );
    dialog.afterClosed$.subscribe((data) => {
      if (data.data !== null) {
        this.articulo.margen = data.data;
        this.articulo.pvp = this.getTwoNumberDecimal(
          this.articulo.puc * (1 + data.data / 100)
        );
        this.form.get("pvp").setValue(this.articulo.pvp);
        this.form.get("pvp").markAsDirty();
      }
    });
  }
}
