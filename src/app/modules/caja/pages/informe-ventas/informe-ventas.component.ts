import { CommonModule, CurrencyPipe, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  inject,
  input,
  InputSignalWithTransform,
  numberAttribute,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import {
  InformeVentasCategoriaInterface,
  InformeVentasResult,
} from '@app/interfaces/informes.interface';
import { Month } from '@app/interfaces/interfaces';
import ConfigService from '@services/config.service';
import InformesService from '@services/informes.service';

@Component({
  selector: 'otpv-informe-ventas',
  imports: [
    NgTemplateOutlet,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe,
    CommonModule,
    MatTooltip,
  ],
  templateUrl: './informe-ventas.component.html',
  styleUrl: './informe-ventas.component.scss',
})
export default class InformeVentasComponent implements OnInit {
  private readonly config: ConfigService = inject(ConfigService);
  private readonly is: InformesService = inject(InformesService);

  loaded: WritableSignal<boolean> = signal<boolean>(false);
  expandedCategories: WritableSignal<Set<number>> = signal<Set<number>>(new Set<number>());
  idCategoria: InputSignalWithTransform<number, unknown> = input.required({
    transform: numberAttribute,
  });
  year: InputSignalWithTransform<number, unknown> = input.required({
    transform: numberAttribute,
  });
  month: InputSignalWithTransform<number, unknown> = input.required({
    transform: numberAttribute,
  });
  monthName: WritableSignal<string> = signal<string>('');
  data: WritableSignal<InformeVentasCategoriaInterface | null> =
    signal<InformeVentasCategoriaInterface | null>(null);

  constructor() {
    document.body.classList.add('white-bg');
  }

  ngOnInit(): void {
    const indMonth: number = this.config.monthList.findIndex((x: Month): boolean => {
      return x.id === this.month();
    });
    this.monthName.set(this.config.monthList[indMonth].name);

    this.is
      .getInformeVentas(this.idCategoria(), this.month(), this.year())
      .subscribe((result: InformeVentasResult): void => {
        this.data.set(result.data);
        this.expandedCategories.set(this.getCategoryIds(result.data));
        this.loaded.set(true);
      });
  }

  hasChildren(categoria: InformeVentasCategoriaInterface): boolean {
    return categoria.articulos.length > 0 || categoria.subcategorias.length > 0;
  }

  isExpanded(categoria: InformeVentasCategoriaInterface): boolean {
    return this.expandedCategories().has(categoria.id);
  }

  toggleCategory(categoria: InformeVentasCategoriaInterface): void {
    this.expandedCategories.update((expanded: Set<number>): Set<number> => {
      const next: Set<number> = new Set<number>(expanded);

      if (next.has(categoria.id)) {
        next.delete(categoria.id);
      } else {
        next.add(categoria.id);
      }

      return next;
    });
  }

  private getCategoryIds(categoria: InformeVentasCategoriaInterface): Set<number> {
    const ids: Set<number> = new Set<number>([categoria.id]);

    categoria.subcategorias.forEach((subcategoria: InformeVentasCategoriaInterface): void => {
      this.getCategoryIds(subcategoria).forEach((id: number): void => {
        ids.add(id);
      });
    });

    return ids;
  }
}
