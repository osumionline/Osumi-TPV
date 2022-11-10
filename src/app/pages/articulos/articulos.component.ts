import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { ActivatedRoute, Params, Router } from "@angular/router";
import {
  ChartDataInterface,
  ChartSelectInterface,
  Month,
} from "src/app/interfaces/interfaces";
import { Articulo } from "src/app/model/articulo.model";
import { Categoria } from "src/app/model/categoria.model";
import { CodigoBarras } from "src/app/model/codigobarras.model";
import { Foto } from "src/app/model/foto.model";
import { IVAOption } from "src/app/model/iva-option.model";
import { Marca } from "src/app/model/marca.model";
import { Proveedor } from "src/app/model/proveedor.model";
import { ApiService } from "src/app/services/api.service";
import { ArticulosService } from "src/app/services/articulos.service";
import { CategoriasService } from "src/app/services/categorias.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ConfigService } from "src/app/services/config.service";
import { DialogService } from "src/app/services/dialog.service";
import { MarcasService } from "src/app/services/marcas.service";
import { ProveedoresService } from "src/app/services/proveedores.service";

@Component({
  selector: "otpv-articulos",
  templateUrl: "./articulos.component.html",
  styleUrls: ["./articulos.component.scss"],
})
export class ArticulosComponent implements OnInit {
  articulo: Articulo = new Articulo();

  marca: Marca = new Marca();
  proveedor: Proveedor = new Proveedor();

  loading: boolean = false;
  selectedTab: number = -1;
  @ViewChild("localizadorBox", { static: true }) localizadorBox: ElementRef;
  mostrarWeb: boolean = false;
  marcas: Marca[] = [];
  nuevaMarca: boolean = false;
  proveedores: Proveedor[] = [];
  nuevoProveedor: boolean = false;
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
  confirmarDarDeBaja: boolean = false;
  darDeBajaLoading: boolean = false;
  mostrarBuscador: boolean = false;

  searchTimer: number = null;
  searching: boolean = false;
  searchName: string = "";
  @ViewChild("searchBoxName", { static: true }) searchBoxName: ElementRef;
  searchMarca: number = -1;
  searchResult: Articulo[] = [];

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: DialogService,
    private as: ApiService,
    private config: ConfigService,
    private cms: ClassMapperService,
    private ms: MarcasService,
    private ps: ProveedoresService,
    private css: CategoriasService,
    private ars: ArticulosService
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
    for (let y = d.getFullYear(); y < d.getFullYear() + 5; y++) {
      this.yearList.push(y);
    }
    this.loadAppData();
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.localizador) {
        this.articulo.localizador = params.localizador;
        this.loadArticulo();
      }
    });
  }

  @HostListener("window:keydown", ["$event"])
  onKeyDown(ev: KeyboardEvent) {
    if (ev.key === "Escape") {
      if (this.nuevaMarca) {
        this.newMarcaCerrar();
      }
      if (this.nuevoProveedor) {
        this.newProveedorCerrar();
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
    this.loadMarcas();
    this.loadProveedores();
    this.loadCategorias();

    this.newArticulo();
  }

  loadMarcas(): void {
    if (this.ms.loaded) {
      this.marcas = this.ms.marcas;
    } else {
      this.ms.getMarcas().subscribe((result) => {
        this.marcas = this.cms.getMarcas(result.list);
        this.ms.loadMarcas(this.marcas);
      });
    }
  }

  loadProveedores(): void {
    if (this.ps.loaded) {
      this.proveedores = this.ps.proveedores;
    } else {
      this.ps.getProveedores().subscribe((result) => {
        this.proveedores = this.cms.getProveedores(result.list);
        this.ps.loadProveedores(this.proveedores);
      });
    }
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
      this.loadArticulo();
    }
  }

  loadArticulo(): void {
    this.loading = true;
    this.ars.loadArticulo(this.articulo.localizador).subscribe((result) => {
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

      this.selectedTab = 0;
      this.loading = false;
    });
  }

  loadFecCad(): void {
    const fecCad = this.articulo.fechaCaducidad.split("-");
    const mes = this.config.monthList.find((x) => x.id === parseInt(fecCad[0]));

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
        this.ms.loaded = false;
        this.loadMarcas();
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

  newProveedor(): void {
    this.proveedor = new Proveedor();
    this.nuevoProveedor = true;
  }

  newProveedorCerrar(ev: MouseEvent = null): void {
    ev && ev.preventDefault();
    this.nuevoProveedor = false;
  }

  addMarcaToProveedor(marca: Marca, ev: MatCheckboxChange): void {
    const ind: number = this.proveedor.marcas.findIndex((x) => x == marca.id);

    if (ev.checked) {
      if (ind === -1) {
        this.proveedor.marcas.push(marca.id);
      }
    } else {
      if (ind !== -1) {
        this.proveedor.marcas.splice(ind, 1);
      }
    }
  }

  guardarProveedor(): void {
    if (!this.proveedor.nombre) {
      this.dialog
        .alert({
          title: "Error",
          content: "¡No puedes dejar el nombre del proveedor en blanco!",
          ok: "Continuar",
        })
        .subscribe((result) => {});
      return;
    }

    if (this.proveedor.marcas.length == 0) {
      this.dialog
        .confirm({
          title: "Confirmar",
          content:
            "No has elegido ninguna marca para el proveedor, ¿quieres continuar?",
          ok: "Continuar",
          cancel: "Cancelar",
        })
        .subscribe((result) => {
          if (result === true) {
            this.guardarProveedorContinue();
          }
        });
    } else {
      this.guardarProveedorContinue();
    }
  }

  guardarProveedorContinue(): void {
    this.ps.saveProveedor(this.proveedor.toInterface()).subscribe((result) => {
      if (result.status == "ok") {
        this.articulo.idProveedor = result.id;
        this.ps.loaded = false;
        this.loadProveedores();
        this.newProveedorCerrar();
      } else {
        this.dialog
          .alert({
            title: "Error",
            content: "Ocurrió un error al guardar el nuevo proveedor",
            ok: "Continuar",
          })
          .subscribe((result) => {});
        return;
      }
    });
  }

  updateIvaRe(ev: string): void {
    const ivaInd = this.config.ivaOptions.findIndex((x) => x.id == ev);
    this.selectedIvaOption.updateValues(
      this.config.ivaOptions[ivaInd].iva,
      this.config.ivaOptions[ivaInd].re
    );

    const ivare: number =
      (this.selectedIvaOption.iva != -1 ? this.selectedIvaOption.iva : 0) +
      (this.selectedIvaOption.re != -1 ? this.selectedIvaOption.re : 0);
    const puc: number = this.getTwoNumberDecimal(
      this.articulo.palb * (1 + ivare / 100)
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
    const fecCadFormat = /[0-9][0-9]-[0-9][0-9]/;
    return this.articulo.fechaCaducidad.match(fecCadFormat) !== null;
  }

  checkFecCad(ev: KeyboardEvent, blur: boolean = false): void {
    if (ev.key == "Enter" || blur) {
      if (this.validateFecCad()) {
        const d = new Date();
        const checkFecCad = this.articulo.fechaCaducidad.split("-");
        const month = this.config.monthList.find(
          (x) => x.id === parseInt(checkFecCad[0])
        );
        const checkD = new Date(
          2000 + parseInt(checkFecCad[1]),
          parseInt(checkFecCad[0]) - 1,
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
              'El formato de fecha introducido no es correcto: mm-aa, por ejemplo Mayo de 2023 sería "05-23".',
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
    this.articulo.palb = ev;

    let ivare = 0;
    if (this.selectedIvaOption.id !== null) {
      ivare =
        (this.selectedIvaOption.iva != -1 ? this.selectedIvaOption.iva : 0) +
        (this.selectedIvaOption.re != -1 ? this.selectedIvaOption.re : 0);
    }
    const puc = this.articulo.palb * (1 + ivare / 100);
    this.updatePuc(this.getTwoNumberDecimal(puc));
  }

  updatePuc(ev: number): void {
    this.articulo.puc = ev;

    this.updateMargen();
  }

  updateMargen(): void {
    if (this.articulo.puc !== 0) {
      this.articulo.margen =
        (this.articulo.pvp * 100) / this.articulo.puc - 100;
    } else {
      this.articulo.margen = 0;
    }
  }

  updatePvp(ev: number): void {
    this.articulo.pvp = ev;

    this.updateMargen();
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
      (x) => x.codigoBarras == codBarras.codigoBarras
    );
    this.articulo.codigosBarras.splice(ind, 1);
  }

  addFoto(): void {
    document.getElementById("foto-file").click();
  }

  onFotoChange(ev: Event): void {
    let reader = new FileReader();
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

  cancelar(): void {}

  guardar(): void {
    this.articulo.stock = this.articulo.stock || 0;
    this.articulo.stockMin = this.articulo.stockMin || 0;
    this.articulo.stockMax = this.articulo.stockMax || 0;
    this.articulo.loteOptimo = this.articulo.loteOptimo || 0;

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
    const ivaInd = this.config.ivaOptions.findIndex(
      (x) => x.id == this.selectedIvaOption.id
    );
    this.articulo.iva = this.config.ivaOptions[ivaInd].iva;
    this.articulo.re = this.config.ivaOptions[ivaInd].re;

    //this.saving = true;
    this.ars.saveArticulo(this.articulo.toInterface()).subscribe((result) => {
      this.articulo.localizador = result.localizador;
      this.dialog
        .alert({
          title: "Información",
          content: "El artículo ha sido guardado correctamente.",
          ok: "Continuar",
        })
        .subscribe((result) => {
          this.saving = false;
          this.loadArticulo();
        });
    });
  }

  abrirBuscador(): void {
    this.searchName = "";
    this.searchMarca = -1;
    this.searchResult = [];
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
    this.loadArticulo();
    this.cerrarBuscador();
  }

  abrirMargenes(): void {
    this.mostrarMargenes = true;
  }

  cerrarMargenes(ev: MouseEvent = null) {
    ev && ev.preventDefault();
    this.mostrarMargenes = false;
  }

  selectMargen(margen: number): void {
    this.articulo.margen = margen;
    this.articulo.pvp = this.getTwoNumberDecimal(
      this.articulo.puc * (1 + margen / 100)
    );

    this.cerrarMargenes();
  }
}
