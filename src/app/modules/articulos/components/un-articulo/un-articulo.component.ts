import {
  Component,
  ElementRef,
  OutputEmitterRef,
  Signal,
  WritableSignal,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabChangeEvent, MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { ArticuloResult, ArticuloSaveResult } from '@interfaces/articulo.interface';
import { AccesosDirectosModal, BuscadorModal, DarDeBajaModal } from '@interfaces/modals.interface';
import Articulo from '@model/articulos/articulo.model';
import ApiStatusEnum from '@model/enum/api-status.enum';
import Marca from '@model/marcas/marca.model';
import AccesosDirectosModalComponent from '@modules/articulos/components/modals/accesos-directos-modal/accesos-directos-modal.component';
import ArticuloDarDeBajaModalComponent from '@modules/articulos/components/modals/articulo-dar-de-baja-modal/articulo-dar-de-baja-modal.component';
import UnArticuloCodBarrasComponent from '@modules/articulos/components/un-articulo-cod-barras/un-articulo-cod-barras.component';
import UnArticuloEstadisticasComponent from '@modules/articulos/components/un-articulo-estadisticas/un-articulo-estadisticas.component';
import UnArticuloGeneralComponent from '@modules/articulos/components/un-articulo-general/un-articulo-general.component';
import UnArticuloHistoricoComponent from '@modules/articulos/components/un-articulo-historico/un-articulo-historico.component';
import UnArticuloObservacionesComponent from '@modules/articulos/components/un-articulo-observaciones/un-articulo-observaciones.component';
import UnArticuloWebComponent from '@modules/articulos/components/un-articulo-web/un-articulo-web.component';
import { DialogService, OverlayService } from '@osumi/angular-tools';
import { getTwoNumberDecimal, urldecode } from '@osumi/tools';
import AlmacenService from '@services/almacen.service';
import ArticulosService from '@services/articulos.service';
import ClassMapperService from '@services/class-mapper.service';
import ConfigService from '@services/config.service';
import MarcasService from '@services/marcas.service';
import VentasService from '@services/ventas.service';
import BuscadorModalComponent from '@shared/components/modals/buscador-modal/buscador-modal.component';
import CustomPaginatorIntl from '@shared/custom-paginator-intl.class';

@Component({
  selector: 'otpv-un-articulo',
  templateUrl: './un-articulo.component.html',
  styleUrls: ['./un-articulo.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
  imports: [
    FormsModule,
    MatSortModule,
    MatFormField,
    MatInput,
    MatCard,
    MatCardContent,
    MatButton,
    MatIconButton,
    MatIcon,
    MatTabGroup,
    MatTabsModule,
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
export default class UnArticuloComponent {
  private readonly router: Router = inject(Router);
  private readonly dialog: DialogService = inject(DialogService);
  private readonly config: ConfigService = inject(ConfigService);
  private readonly cms: ClassMapperService = inject(ClassMapperService);
  private readonly ms: MarcasService = inject(MarcasService);
  private readonly ars: ArticulosService = inject(ArticulosService);
  private readonly vs: VentasService = inject(VentasService);
  private readonly als: AlmacenService = inject(AlmacenService);
  private readonly overlayService: OverlayService = inject(OverlayService);

  articulo: Articulo = new Articulo();
  ind: number = -1;
  duplicarArticuloEvent: OutputEmitterRef<Articulo> = output<Articulo>();
  cerrarArticuloEvent: OutputEmitterRef<number> = output<number>();
  updateArticuloEvent: OutputEmitterRef<void> = output<void>();

  loading: boolean = true;
  selectedTab: number = -1;
  localizadorBox: Signal<ElementRef> = viewChild.required<ElementRef>('localizadorBox');
  mostrarWeb: WritableSignal<boolean> = signal<boolean>(false);

  general: Signal<UnArticuloGeneralComponent> =
    viewChild.required<UnArticuloGeneralComponent>('general');
  codBarras: Signal<UnArticuloCodBarrasComponent> =
    viewChild.required<UnArticuloCodBarrasComponent>('codBarras');
  estadisticas: Signal<UnArticuloEstadisticasComponent | undefined> = viewChild<
    UnArticuloEstadisticasComponent | undefined
  >('estadisticas');
  historico: Signal<UnArticuloHistoricoComponent> =
    viewChild.required<UnArticuloHistoricoComponent>('historico');

  saving: WritableSignal<boolean> = signal<boolean>(false);
  showBuscador: boolean = false;

  load(articulo: Articulo, ind: number): void {
    this.articulo = articulo;
    this.ind = ind;
    this.mostrarWeb.set(this.config.ventaOnline);

    switch (this.articulo.status) {
      case 'new':
        {
          this.focus();
        }
        break;
      case 'load':
        {
          this.loadArticulo();
        }
        break;
    }
    this.loading = false;
  }

  getArticulo(): Articulo {
    return this.articulo;
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
        modalTitle: 'Buscador',
        modalColor: 'blue',
        css: 'modal-wide',
        key: ev.key,
      };
      const dialog = this.overlayService.open(BuscadorModalComponent, modalBuscadorData);
      dialog.afterClosed$.subscribe((data): void => {
        this.showBuscador = false;
        if (data.data !== null) {
          this.articulo.localizador = data.data;
          this.loadArticulo();
        } else {
          this.focus();
        }
      });

      return;
    }
    if (ev.key == 'Enter') {
      ev.preventDefault();
      ev.stopPropagation();

      this.loadArticulo();
    }
  }

  loadArticulo(): void {
    this.ars
      .loadArticulo(this.articulo.localizador as number)
      .subscribe((result: ArticuloResult): void => {
        if (result.status === ApiStatusEnum.OK) {
          this.articulo = this.cms.getArticulo(result.articulo);
          if (this.articulo.pvpDescuento !== null) {
            const importeDescuento: number = (this.articulo.pvp ?? 0) - this.articulo.pvpDescuento;
            this.articulo.porcentajeDescuento = getTwoNumberDecimal(
              (importeDescuento / (this.articulo.pvp ?? 1)) * -100
            );
          }
          this.articulo.tabName = this.articulo.nombre;
          this.updateArticuloEvent.emit();

          setTimeout((): void => {
            this.loadExtraInfo();
          }, 0);
        } else {
          this.dialog
            .alert({
              title: 'Error',
              content:
                'No existe ningún artículo con el localizador "' + this.articulo.localizador + '".',
            })
            .subscribe((): void => {
              this.articulo.localizador = null;
              setTimeout((): void => {
                this.localizadorBox().nativeElement.select();
              }, 200);
            });
        }
      });
  }

  loadExtraInfo(): void {
    if (this.articulo.fechaCaducidad) {
      this.general().loadFecCad();
    }

    const estadisticas: UnArticuloEstadisticasComponent | undefined = this.estadisticas();
    if (this.articulo.id !== null && estadisticas !== undefined && this.historico()) {
      estadisticas.loadStatsVentas();
      estadisticas.loadStatsWeb();
      this.historico().loadHistorico();
    }

    if (this.articulo.idMarca !== null) {
      const marca: Marca | null = this.ms.findById(this.articulo.idMarca);
      if (marca !== null) {
        this.articulo.marca = marca.nombre;
      }
    }
    this.articulo.status = 'loaded';
  }

  abrirAccesosDirectos(): void {
    const modalAccesosDirectosData: AccesosDirectosModal = {
      modalTitle: 'Accesos directos',
      modalColor: 'blue',
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
      this.focus();
    });
  }

  checkArticulosTab(ev: MatTabChangeEvent): void {
    if (ev.index === 2) {
      setTimeout((): void => {
        this.codBarras().focus();
      }, 0);
    }
  }

  focus(): void {
    this.selectedTab = 0;
    setTimeout((): void => {
      this.localizadorBox().nativeElement.focus();
    }, 0);
  }

  darDeBaja(): void {
    const modalDarDeBajaData: DarDeBajaModal = {
      modalTitle: 'Confirmar',
      modalColor: 'red',
      id: this.articulo.id,
      nombre: this.articulo.nombre,
    };
    const dialog = this.overlayService.open(ArticuloDarDeBajaModalComponent, modalDarDeBajaData);
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data === true) {
        this.focus();
      }
    });
  }

  goToReturn(): void {
    if (this.ars.returnInfo !== null) {
      switch (this.ars.returnInfo.where) {
        case 'ventas':
          {
            this.vs.updateArticulo(this.articulo);
            this.router.navigate(['/ventas']);
          }
          break;
        case 'pedido':
          {
            this.ars.returnInfo.extra = this.articulo.localizador;
            this.router.navigate(['/compras/pedido/', this.ars.returnInfo.id]);
          }
          break;
        case 'pedido-edit':
          {
            this.ars.returnInfo.extra = null;
            this.router.navigate(['/compras/pedido/', this.ars.returnInfo.id]);
          }
          break;
        case 'almacen':
          {
            this.als.updateArticulo(this.articulo);
            this.router.navigate(['/almacen']);
          }
          break;
      }
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

    if (this.articulo.nombre === null || this.articulo.nombre === '') {
      this.dialog.alert({
        title: 'Error',
        content: '¡No puedes dejar en blanco el nombre del artículo!',
      });
      return;
    }

    if (!this.articulo.idMarca) {
      this.dialog.alert({
        title: 'Error',
        content: '¡No has elegido la marca del artículo!',
      });
      this.selectedTab = 0;
      return;
    }

    this.saving.set(true);
    this.ars
      .saveArticulo(this.articulo.toInterface())
      .subscribe((result: ArticuloSaveResult): void => {
        if (result.status === ApiStatusEnum.OK) {
          this.articulo.localizador = result.localizador;
          this.dialog
            .alert({
              title: 'Información',
              content: 'El artículo ha sido guardado correctamente.',
            })
            .subscribe((): void => {
              this.saving.set(false);
              if (this.ars.returnInfo === null) {
                if (cerrar) {
                  this.cerrarArticuloEvent.emit(this.ind);
                } else {
                  this.updateArticuloEvent.emit();
                }
                this.articulo.nombreStatus = 'ok';
                this.loadArticulo();
              } else {
                this.goToReturn();
              }
            });
        } else {
          this.saving.set(false);
          if (result.status === ApiStatusEnum.NOMBRE_USED) {
            this.dialog
              .confirm({
                title: 'Confirmar',
                content: `Ya existe un artículo con el nombre "${
                  this.articulo.nombre
                }" para la marca "${urldecode(result.message)}" , ¿quieres continuar?`,
              })
              .subscribe((result: boolean): void => {
                if (result === true) {
                  this.articulo.nombreStatus = 'checked';
                  this.guardar(cerrar);
                }
              });
          }
          if (result.status === ApiStatusEnum.REFERENCIA_USED) {
            this.dialog
              .alert({
                title: 'Error',
                content: `La referencia "${
                  this.articulo.referencia
                }" ya está en uso por el artículo "${urldecode(result.message)}".`,
              })
              .subscribe((): void => {
                this.selectedTab = 0;
              });
          }
          if (result.status === ApiStatusEnum.CB_USED) {
            const data: string[] = urldecode(result.message).split('/');
            this.dialog
              .alert({
                title: 'Error',
                content: `El código de barras "${data[0]}" ya está en uso por el artículo "${data[1]}/${data[2]}".`,
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
        title: 'Confirmar',
        content: '¿Quieres duplicar este artículo y crear uno nuevo?',
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.duplicarArticuloEvent.emit(this.articulo);
        }
      });
  }
}
