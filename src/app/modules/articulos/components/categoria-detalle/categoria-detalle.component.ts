import {
  Component,
  inject,
  input,
  InputSignal,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { CategoriaArticulosResult } from '@interfaces/articulo.interface';
import Articulo from '@model/articulos/articulo.model';
import Categoria from '@model/articulos/categoria.model';
import CategoriasService from '@services/categorias.service';
import ClassMapperService from '@services/class-mapper.service';

@Component({
  selector: 'otpv-categoria-detalle',
  imports: [],
  templateUrl: './categoria-detalle.component.html',
  styleUrl: './categoria-detalle.component.scss',
})
export default class CategoriaDetalleComponent implements OnInit {
  private readonly cs: CategoriasService = inject(CategoriasService);
  private readonly cms: ClassMapperService = inject(ClassMapperService);

  categoria: InputSignal<Categoria> = input.required<Categoria>();
  articulos: WritableSignal<Articulo[]> = signal<Articulo[]>([]);

  ngOnInit(): void {
    this.cs
      .getArticulosCategoria(this.categoria().id!)
      .subscribe((result: CategoriaArticulosResult): void => {
        this.articulos.set(this.cms.getArticulos(result.list));
        console.log(this.articulos());
      });
  }
}
