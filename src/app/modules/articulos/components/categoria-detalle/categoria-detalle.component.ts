import {
  Component,
  effect,
  inject,
  input,
  InputSignal,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CategoriaArticulosResult, CategoriaArticulosSave } from '@interfaces/articulo.interface';
import { StatusResult } from '@interfaces/interfaces';
import { BuscadorModal } from '@interfaces/modals.interface';
import { LocalizadoresResult } from '@interfaces/venta.interface';
import Articulo from '@model/articulos/articulo.model';
import Categoria from '@model/articulos/categoria.model';
import { DialogService, OverlayService } from '@osumi/angular-tools';
import CategoriasService from '@services/categorias.service';
import ClassMapperService from '@services/class-mapper.service';
import VentasService from '@services/ventas.service';
import BuscadorAvanzadoModalComponent from '@shared/components/modals/buscador-avanzado-modal/buscador-avanzado-modal.component';

@Component({
  selector: 'otpv-categoria-detalle',
  imports: [MatButton, MatIconButton, MatTableModule, MatIcon],
  templateUrl: './categoria-detalle.component.html',
  styleUrl: './categoria-detalle.component.scss',
})
export default class CategoriaDetalleComponent {
  private readonly cs: CategoriasService = inject(CategoriasService);
  private readonly vs: VentasService = inject(VentasService);
  private readonly cms: ClassMapperService = inject(ClassMapperService);
  private readonly overlayService: OverlayService = inject(OverlayService);
  private readonly dialog: DialogService = inject(DialogService);

  categoria: InputSignal<Categoria> = input.required<Categoria>();
  articulos: WritableSignal<Articulo[]> = signal<Articulo[]>([]);

  articulosResultadosDisplayedColumns: string[] = ['localizador', 'nombre', 'borrar'];
  articulosResultadosDataSource: MatTableDataSource<Articulo> = new MatTableDataSource<Articulo>();
  saved: WritableSignal<boolean> = signal<boolean>(false);

  private lastCategoriaId: number | null = null;

  constructor() {
    effect((): void => {
      const currentCategoria: Categoria = this.categoria();
      if (currentCategoria && currentCategoria.id !== this.lastCategoriaId) {
        this.lastCategoriaId = currentCategoria.id;
        this.loadArticulos();
      }
    });
  }

  private loadArticulos(): void {
    this.cs
      .getArticulosCategoria(this.categoria().id!)
      .subscribe((result: CategoriaArticulosResult): void => {
        this.articulos.set(this.cms.getArticulos(result.list));
        this.articulosResultadosDataSource.data = this.articulos();
        console.log(this.articulos());
      });
  }

  search(): void {
    const modalBuscadorData: BuscadorModal = {
      modalTitle: 'Buscador',
      modalColor: 'blue',
      css: 'modal-wide',
      key: '',
      showSelect: true,
    };
    const dialog = this.overlayService.open(BuscadorAvanzadoModalComponent, modalBuscadorData);
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data !== null) {
        this.loadSearchResults(data.data);
      }
    });
  }

  loadSearchResults(data: number | number[]): void {
    if (!Array.isArray(data)) {
      data = [data];
    }

    // Filtrar los localizadores que no están en los artículos actuales
    const existingLocalizadores: (number | null)[] = this.articulos().map(
      (articulo: Articulo): number | null => articulo.localizador,
    );
    const newLocalizadores: number[] = data.filter(
      (locator: number): boolean => !existingLocalizadores.includes(locator),
    );

    // Busco los nuevos artículos por su localizador y los añado a la lista
    if (newLocalizadores.length > 0) {
      this.vs
        .getLocalizadores(newLocalizadores.join(','))
        .subscribe((result: LocalizadoresResult) => {
          const articulos: Articulo[] = this.cms.getArticulos(result.list);
          this.articulos.set([...this.articulos(), ...articulos]);
          this.articulosResultadosDataSource.data = this.articulos();
          console.log('Artículos actualizados:', this.articulos());
        });
    }
  }

  removeArticulo(articulo: Articulo): void {
    this.articulos.set(
      this.articulos().filter((a: Articulo): boolean => a.localizador !== articulo.localizador),
    );
  }

  save(): void {
    const data: CategoriaArticulosSave = {
      idCategoria: this.categoria().id!,
      idArticulos: this.articulos().map((articulo: Articulo): number => articulo.id!) as number[],
    };
    this.cs.saveArticulosCategoria(data).subscribe((result: StatusResult): void => {
      if (result.status !== 'ok') {
        this.dialog.alert({
          title: 'Error',
          content: 'Error al actualizar la categoría',
        });
      } else {
        this.saved.set(true);
        setTimeout((): void => {
          this.saved.set(false);
        }, 3000);
      }
    });
  }
}
