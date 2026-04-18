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
  private readonly ars: ArticulosService = inject(ArticulosService);

  articulos: WritableSignal<Articulo[]> = signal<Articulo[]>([]);
  selected: WritableSignal<number> = signal<number>(-1);

  articulo: Signal<UnArticuloComponent> = viewChild.required<UnArticuloComponent>('articulo');

  private setArticulos(articulos: Articulo[]): void {
    this.articulos.set([...articulos]);
    this.ars.updateArticulos([...articulos]);
  }

  private updateArticulos(updateFn: (articulos: Articulo[]) => Articulo[]): void {
    this.setArticulos(updateFn([...this.articulos()]));
  }

  private setSelected(ind: number): void {
    this.selected.set(ind);
    this.ars.updateSelected(ind);
  }

  ngOnInit(): void {
    this.articulos.set([...this.ars.list()]);
    this.selected.set(this.ars.selected());
    if (this.articulos().length === 0) {
      this.createNewTab();
      return;
    }
    this.articulo().load(this.articulos()[this.selected()], this.selected());
  }

  changeSelectedTab(ind: number, save: boolean = true): void {
    if (save) {
      this.updateArticulo();
    }
    this.setSelected(ind);
    if (ind !== -1) {
      this.articulo().load(this.articulos()[this.selected()], this.selected());
    }
  }

  createNewTab(): void {
    const articulo: Articulo = this.ars.createNewArticulo();
    this.updateArticulos((value: Articulo[]): Articulo[] => {
      value.push(articulo);
      return value;
    });
    this.changeSelectedTab(this.articulos().length - 1);
  }

  closeTab(ind: number): void {
    this.updateArticulos((value: Articulo[]): Articulo[] => {
      value.splice(ind, 1);
      return value;
    });
    if (this.articulos().length === 0) {
      this.createNewTab();
      return;
    }
    this.changeSelectedTab(this.newSelected(ind), false);
  }

  updateArticulo(): void {
    const currentArticulo: Articulo = this.articulo().getArticulo();
    if (this.selected() === -1 || currentArticulo === undefined) {
      return;
    }
    this.updateArticulos((value: Articulo[]): Articulo[] => {
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
    const nuevoArticulo: Articulo = new Articulo().fromInterface(articulo.toInterface());
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
    this.updateArticulo();
    this.updateArticulos((value: Articulo[]): Articulo[] => {
      value.push(nuevoArticulo);
      return value;
    });
    this.changeSelectedTab(this.articulos().length - 1, false);
  }

  ngOnDestroy(): void {
    this.updateArticulo();
  }
}
