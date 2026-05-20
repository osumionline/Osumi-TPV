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
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import {
  InformeVentasArticuloInterface,
  InformeVentasCategoriaInterface,
  InformeVentasResult,
} from '@interfaces/informes.interface';
import { Month } from '@interfaces/interfaces';
import ConfigService from '@services/config.service';
import InformesService from '@services/informes.service';

interface InformeVentasMarcaInterface {
  idMarca: number;
  marca: string;
  importe: number;
  unidades: number;
  margen: number;
}

@Component({
  selector: 'otpv-informe-ventas',
  imports: [
    NgTemplateOutlet,
    MatButtonModule,
    MatCheckbox,
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
  private readonly marcasByCategoria: WeakMap<
    InformeVentasCategoriaInterface,
    InformeVentasMarcaInterface[]
  > = new WeakMap<InformeVentasCategoriaInterface, InformeVentasMarcaInterface[]>();

  loaded: WritableSignal<boolean> = signal<boolean>(false);
  expandedCategories: WritableSignal<Set<number>> = signal<Set<number>>(new Set<number>());
  groupByBrand: WritableSignal<boolean> = signal<boolean>(false);
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

  getMarcas(categoria: InformeVentasCategoriaInterface): InformeVentasMarcaInterface[] {
    const cachedMarcas: InformeVentasMarcaInterface[] | undefined =
      this.marcasByCategoria.get(categoria);

    if (cachedMarcas) {
      return cachedMarcas;
    }

    const marcas: Map<number, InformeVentasMarcaInterface & { margenImporte: number }> = new Map<
      number,
      InformeVentasMarcaInterface & { margenImporte: number }
    >();

    categoria.articulos.forEach((articulo: InformeVentasArticuloInterface): void => {
      const marca: InformeVentasMarcaInterface & { margenImporte: number } = marcas.get(
        articulo.idMarca,
      ) ?? {
        idMarca: articulo.idMarca,
        marca: articulo.marca,
        importe: 0,
        unidades: 0,
        margen: 0,
        margenImporte: 0,
      };

      marca.importe += articulo.importe;
      marca.unidades += articulo.unidades;
      marca.margenImporte += articulo.importe * articulo.margen;

      marcas.set(articulo.idMarca, marca);
    });

    const result: InformeVentasMarcaInterface[] = Array.from(marcas.values()).map(
      (marca: InformeVentasMarcaInterface & { margenImporte: number }): InformeVentasMarcaInterface => {
        return {
          idMarca: marca.idMarca,
          marca: marca.marca,
          importe: marca.importe,
          unidades: marca.unidades,
          margen: marca.importe === 0 ? 0 : marca.margenImporte / marca.importe,
        };
      },
    );

    this.marcasByCategoria.set(categoria, result);

    return result;
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
