import {
  Component,
  ElementRef,
  inject,
  signal,
  Signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { ArticuloResult } from '@interfaces/articulo.interface';
import { BuscadorModal } from '@interfaces/modals.interface';
import Caducidad from '@model/almacen/caducidad.model';
import Articulo from '@model/articulos/articulo.model';
import ApiStatusEnum from '@model/enum/api-status.enum';
import { CustomOverlayRef, OverlayService } from '@osumi/angular-tools';
import ArticulosService from '@services/articulos.service';
import ClassMapperService from '@services/class-mapper.service';
import BuscadorModalComponent from '@shared/components/modals/buscador-modal/buscador-modal.component';

@Component({
  selector: 'otpv-caducidad-modal',
  imports: [MatFormField, MatLabel, MatInput, FormsModule, MatButton, MatIcon],
  templateUrl: './caducidad-modal.component.html',
  styleUrl: './caducidad-modal.component.scss',
})
export default class CaducidadModalComponent {
  private readonly os: OverlayService = inject(OverlayService);
  private readonly ars: ArticulosService = inject(ArticulosService);
  private readonly cms: ClassMapperService = inject(ClassMapperService);
  private readonly customOverlayRef: CustomOverlayRef<null, { caducidad: Caducidad }> = inject(
    CustomOverlayRef<null, { caducidad: Caducidad }>
  );

  articulo: Articulo = new Articulo();
  articuloSelected: WritableSignal<boolean> = signal<boolean>(false);
  articuloName: string | null = 'Elige un artículo';
  unidades: number = 0;
  showBuscador: boolean = false;
  localizadorBox: Signal<ElementRef> = viewChild.required<ElementRef>('localizadorBox');

  focus(): void {
    setTimeout((): void => {
      this.localizadorBox().nativeElement.focus();
    }, 0);
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
      const dialog = this.os.open(BuscadorModalComponent, modalBuscadorData);
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
          this.articuloName = this.articulo.nombre;
          this.articuloSelected.set(true);
        }
      });
  }

  addCaducidad(): void {
    const cad: Caducidad = new Caducidad();
    cad.articulo = this.articulo;
    cad.unidades = this.unidades;
    this.customOverlayRef.close(cad);
  }
}
