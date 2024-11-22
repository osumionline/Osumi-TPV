import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import Articulo from '@model/articulos/articulo.model';
import ArticulosTabsComponent from '@modules/articulos/components/articulos-tabs/articulos-tabs.component';
import UnArticuloComponent from '@modules/articulos/components/un-articulo/un-articulo.component';
import ArticulosService from '@services/articulos.service';
import HeaderComponent from '@shared/components/header/header.component';

@Component({
  selector: 'otpv-articulos',
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.scss'],
  imports: [HeaderComponent, ArticulosTabsComponent, UnArticuloComponent],
})
export default class ArticulosComponent implements OnInit, OnDestroy {
  private ars: ArticulosService = inject(ArticulosService);

  articulos: WritableSignal<Articulo[]> = signal<Articulo[]>([]);
  selected: WritableSignal<number> = signal<number>(-1);

  articulo: Signal<UnArticuloComponent> =
    viewChild.required<UnArticuloComponent>('articulo');

  ngOnInit(): void {
    this.articulos.set([...this.ars.list()]);
    this.selected.set(this.ars.selected());
    if (this.articulos().length === 0) {
      this.createNewTab();
    }
    this.articulo().load(this.articulos()[this.selected()], this.selected());
  }

  changeSelectedTab(ind: number, save: boolean = true): void {
    if (save) {
      this.updateArticulo();
    }
    this.selected.set(ind);
    this.articulo().load(this.articulos()[this.selected()], this.selected());
  }

  createNewTab(): void {
    const articulo: Articulo = this.ars.createNewArticulo();
    this.articulos.update((value: Articulo[]): Articulo[] => {
      value.push(articulo);
      return value;
    });
    this.changeSelectedTab(this.articulos().length - 1);
  }

  closeTab(ind: number): void {
    this.articulos.update((value: Articulo[]): Articulo[] => {
      value.splice(ind, 1);
      return value;
    });
    this.changeSelectedTab(this.newSelected(ind), false);
  }

  updateArticulo(): void {
    const currentArticulo: Articulo = this.articulo().getArticulo();
    this.articulos.update((value: Articulo[]): Articulo[] => {
      value[this.selected()] = currentArticulo;
      return value;
    });
  }

  newSelected(indexToClose: number): number {
    if (this.articulos().length === 0) {
      return -1;
    }

    if (indexToClose < this.selected()) {
      return this.selected() - 1;
    }

    if (indexToClose === this.selected()) {
      if (indexToClose === this.articulos().length) {
        return this.articulos().length - 1;
      }
      return this.selected();
    }

    return this.selected();
  }

  duplicate(articulo: Articulo): void {
    const nuevoArticulo: Articulo = new Articulo().fromInterface(
      articulo.toInterface()
    );
    nuevoArticulo.id = null;
    nuevoArticulo.localizador = null;
    const nuevoNombre: string = `${nuevoArticulo.nombre} (copia)`;
    nuevoArticulo.nombre = nuevoNombre;
    nuevoArticulo.tabName = nuevoNombre;
    nuevoArticulo.referencia = '';
    nuevoArticulo.codigosBarras = [];
    nuevoArticulo.fechaCaducidad = null;
    nuevoArticulo.stock = 0;
    nuevoArticulo.status = 'new';
    nuevoArticulo.observaciones = '';
    this.articulos.update((value: Articulo[]): Articulo[] => {
      value.push(nuevoArticulo);
      return value;
    });
    this.selected.set(this.articulos().length - 1);
  }

  ngOnDestroy(): void {
    this.updateArticulo();
    this.ars.updateArticulos(this.articulos());
    this.ars.updateSelected(this.selected());
  }
}
