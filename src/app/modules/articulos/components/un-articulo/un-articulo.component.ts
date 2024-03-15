import { NgClass, NgStyle } from "@angular/common";
import {
  Component,
  ElementRef,
  Input,
  InputSignal,
  OnDestroy,
  OnInit,
  OutputEmitterRef,
  Signal,
  ViewChild,
  WritableSignal,
  input,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatCard, MatCardContent } from "@angular/material/card";
import { MatFormField } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from "@angular/material/paginator";
import { MatSelect } from "@angular/material/select";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTab, MatTabChangeEvent, MatTabGroup } from "@angular/material/tabs";
import { Router } from "@angular/router";
import { urldecode } from "@osumi/tools";
import { QRCodeModule } from "angularx-qrcode";
import {
  ArticuloResult,
  ArticuloSaveResult,
} from "src/app/interfaces/articulo.interface";
import {
  AccesosDirectosModal,
  BuscadorModal,
  DarDeBajaModal,
} from "src/app/interfaces/modals.interface";
import { Articulo } from "src/app/model/articulos/articulo.model";
import { Marca } from "src/app/model/marcas/marca.model";
import { AccesosDirectosModalComponent } from "src/app/modules/articulos/components/modals/accesos-directos-modal/accesos-directos-modal.component";
import { ArticuloDarDeBajaModalComponent } from "src/app/modules/articulos/components/modals/articulo-dar-de-baja-modal/articulo-dar-de-baja-modal.component";
import { UnArticuloCodBarrasComponent } from "src/app/modules/articulos/components/un-articulo-cod-barras/un-articulo-cod-barras.component";
import { UnArticuloGeneralComponent } from "src/app/modules/articulos/components/un-articulo-general/un-articulo-general.component";
import { BuscadorModalComponent } from "src/app/modules/shared/components/modals/buscador-modal/buscador-modal.component";
import { CustomPaginatorIntl } from "src/app/modules/shared/custom-paginator-intl.class";
import { FixedNumberPipe } from "src/app/modules/shared/pipes/fixed-number.pipe";
import { AlmacenService } from "src/app/services/almacen.service";
import { ArticulosService } from "src/app/services/articulos.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ConfigService } from "src/app/services/config.service";
import { DialogService } from "src/app/services/dialog.service";
import { MarcasService } from "src/app/services/marcas.service";
import { OverlayService } from "src/app/services/overlay.service";
import { ProveedoresService } from "src/app/services/proveedores.service";
import { VentasService } from "src/app/services/ventas.service";
import { UnArticuloEstadisticasComponent } from "../un-articulo-estadisticas/un-articulo-estadisticas.component";
import { UnArticuloHistoricoComponent } from "../un-articulo-historico/un-articulo-historico.component";
import { UnArticuloObservacionesComponent } from "../un-articulo-observaciones/un-articulo-observaciones.component";
import { UnArticuloWebComponent } from "../un-articulo-web/un-articulo-web.component";

@Component({
  standalone: true,
  selector: "otpv-un-articulo",
  templateUrl: "./un-articulo.component.html",
  styleUrls: ["./un-articulo.component.scss"],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
  imports: [
    NgClass,
    NgStyle,
    FormsModule,
    MatSortModule,
    QRCodeModule,
    FixedNumberPipe,
    MatFormField,
    MatInput,
    MatCard,
    MatCardContent,
    MatButton,
    MatIconButton,
    MatIcon,
    MatTabGroup,
    MatTab,
    MatSelect,
    MatSlideToggle,
    MatTableModule,
    MatPaginatorModule,
    UnArticuloGeneralComponent,
    UnArticuloCodBarrasComponent,
    UnArticuloEstadisticasComponent,
    UnArticuloWebComponent,
    UnArticuloHistoricoComponent,
    UnArticuloObservacionesComponent,
  ],
})
export class UnArticuloComponent implements OnInit, OnDestroy {
  _articulo: Articulo = null;
  @Input() set articulo(a: Articulo) {
    this._articulo = a === null ? new Articulo() : a;
    console.log("set articulo");
    console.log(a);
    this.loadArticuloObj();
  }
  get articulo(): Articulo {
    return this._articulo;
  }
  ind: InputSignal<number> = input.required<number>();
  duplicarArticuloEvent: OutputEmitterRef<Articulo> = output<Articulo>();
  cerrarArticuloEvent: OutputEmitterRef<number> = output<number>();

  loading: boolean = false;
  selectedTab: number = -1;
  localizadorBox: Signal<ElementRef> =
    viewChild.required<ElementRef>("localizadorBox");
  mostrarWeb: WritableSignal<boolean> = signal<boolean>(false);

  @ViewChild("general", { static: false }) general!: UnArticuloGeneralComponent;
  @ViewChild("codBarras", { static: false })
  codBarras!: UnArticuloCodBarrasComponent;
  @ViewChild("estadisticas", { static: false })
  estadisticas!: UnArticuloEstadisticasComponent;
  @ViewChild("historico", { static: false })
  historico!: UnArticuloHistoricoComponent;

  saving: WritableSignal<boolean> = signal<boolean>(false);
  showBuscador: boolean = false;

  constructor(
    private router: Router,
    private dialog: DialogService,
    private config: ConfigService,
    private cms: ClassMapperService,
    public ms: MarcasService,
    public ps: ProveedoresService,
    private ars: ArticulosService,
    private vs: VentasService,
    private als: AlmacenService,
    private overlayService: OverlayService
  ) {}

  ngOnInit(): void {
    this.loadAppData();
  }

  loadAppData(): void {
    this.mostrarWeb.set(this.config.ventaOnline);

    switch (this.articulo.status) {
      case "new":
        {
          this.newArticulo();
        }
        break;
      case "load":
        {
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
          this.articulo.localizador = data.data;
          this.loadArticulo();
        } else {
          this.localizadorBox().nativeElement.focus();
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
      .loadArticulo(this.articulo.localizador)
      .subscribe((result: ArticuloResult): void => {
        if (result.status === "ok") {
          const tabName: string = this.articulo.tabName;
          this._articulo = this.cms.getArticulo(result.articulo);
          this._articulo.tabName = tabName;
          console.log("loadArticulo result");

          setTimeout((): void => {
            this.loadExtraInfo();
          }, 0);
        } else {
          this.dialog
            .alert({
              title: "Error",
              content:
                'No existe ningún artículo con el localizador "' +
                this.articulo.localizador +
                '".',
              ok: "Continuar",
            })
            .subscribe((): void => {
              this.articulo.localizador = null;
              this.loading = false;
              setTimeout((): void => {
                this.localizadorBox().nativeElement.select();
              }, 200);
            });
        }
      });
  }

  loadExtraInfo(): void {
    console.log("loadExtraInfo");
    if (this.articulo.fechaCaducidad) {
      this.general.loadFecCad();
    }

    if (this.articulo.id !== null) {
      console.log(this.estadisticas);
      this.estadisticas.loadStatsVentas();
      this.estadisticas.loadStatsWeb();
      this.historico.loadHistorico();
    }

    if (this.articulo.idMarca !== null) {
      const marca: Marca = this.ms.findById(this.articulo.idMarca);
      this.articulo.marca = marca.nombre;
    }
  }

  loadArticuloObj(): void {
    console.log("loadArticuloObj");
    this.loadExtraInfo();

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
        this.articulo.localizador = data.data;
        this.loadArticulo();
      }
      setTimeout((): void => {
        this.localizadorBox().nativeElement.focus();
      }, 0);
    });
  }

  checkArticulosTab(ev: MatTabChangeEvent): void {
    if (ev.index === 2) {
      setTimeout((): void => {
        this.codBarras.focus();
      }, 0);
    }
  }

  newArticulo(): void {
    const tabName: string = this.articulo.tabName;
    this.articulo = new Articulo();
    this.articulo.tabName = tabName;
    this.selectedTab = 0;
    setTimeout((): void => {
      this.localizadorBox().nativeElement.focus();
    }, 0);
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
    /*this.form.reset();
    this.form.patchValue(this.articulo.toInterface(false));
    this.form.get("localizador").markAsPristine();
    this.form.get("palb").markAsPristine();
    this.form.get("puc").markAsPristine();
    this.form.get("pvp").markAsPristine();*/

    if (this.ars.returnInfo !== null) {
      this.goToReturn();
    }
  }

  guardarYCerrar(): void {
    this.guardar(true);
  }

  guardar(cerrar: boolean = false): void {
    this.articulo.stock = this.articulo.stock || 0;
    this.articulo.stockMin = this.articulo.stockMin || 0;
    this.articulo.stockMax = this.articulo.stockMax || 0;
    this.articulo.loteOptimo = this.articulo.loteOptimo || 0;
    this.articulo.palb = this.articulo.palb || 0;
    this.articulo.puc = this.articulo.puc || 0;
    this.articulo.pvp = this.articulo.pvp || 0;
    this.articulo.margen = this.articulo.margen || 0;

    if (this.articulo.nombre === null || this.articulo.nombre === "") {
      this.dialog.alert({
        title: "Error",
        content: "¡No puedes dejar en blanco el nombre del artículo!",
        ok: "Continuar",
      });
      return;
    }

    if (!this.articulo.idMarca) {
      this.dialog.alert({
        title: "Error",
        content: "¡No has elegido la marca del artículo!",
        ok: "Continuar",
      });
      this.selectedTab = 0;
      return;
    }

    this.saving.set(true);
    this.ars
      .saveArticulo(this.articulo.toInterface())
      .subscribe((result: ArticuloSaveResult): void => {
        if (result.status === "ok") {
          this.articulo.localizador = result.localizador;
          this.dialog
            .alert({
              title: "Información",
              content: "El artículo ha sido guardado correctamente.",
              ok: "Continuar",
            })
            .subscribe((): void => {
              this.saving.set(false);
              if (cerrar) {
                this.cerrarArticuloEvent.emit(this.ind());
              }
              if (this.ars.returnInfo === null) {
                this.articulo.nombreStatus = "ok";
                this.loadArticulo();
              } else {
                this.goToReturn();
              }
            });
        } else {
          this.saving.set(false);
          if (result.status === "nombre-used") {
            this.dialog
              .confirm({
                title: "Confirmar",
                content: `Ya existe un artículo con el nombre "${
                  this.articulo.nombre
                }" para la marca "${urldecode(
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
                }" ya está en uso por el artículo "${urldecode(
                  result.message
                )}".`,
                ok: "Continuar",
              })
              .subscribe((): void => {
                this.selectedTab = 0;
              });
          }
          if (result.status === "cb-used") {
            const data: string[] = urldecode(result.message).split("/");
            this.dialog
              .alert({
                title: "Error",
                content: `El código de barras "${data[0]}" ya está en uso por el artículo "${data[1]}/${data[2]}".`,
                ok: "Continuar",
              })
              .subscribe((): void => {
                this.selectedTab = 1;
              });
          }
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
    if (this.ars.list[this.ind()] !== undefined) {
      this.ars.list[this.ind()] = this.articulo;
    }
  }
}
