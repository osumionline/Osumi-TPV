import { Component, computed, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { CategoriaInterface } from '@interfaces/articulo.interface';
import { Month } from '@interfaces/interfaces';
import CategoriasService from '@services/categorias.service';
import ConfigService from '@services/config.service';

@Component({
  selector: 'otpv-generar-informe',
  imports: [MatFormField, MatSelect, MatOption, MatButton, FormsModule],
  templateUrl: './generar-informe.component.html',
  styleUrl: './generar-informe.component.scss',
})
export default class GenerarInformeComponent implements OnInit {
  private readonly config: ConfigService = inject(ConfigService);
  private readonly cs: CategoriasService = inject(CategoriasService);

  monthList: Month[] = [];
  yearList: number[] = [];
  categoriesPlain: WritableSignal<CategoriaInterface[]> = signal<CategoriaInterface[]>(
    this.cs.categoriasPlain,
  );
  informeTipo: WritableSignal<string | null> = signal<string | null>(null);
  informeMonth: WritableSignal<number | null> = signal<number | null>(null);
  informeYear: WritableSignal<number | null> = signal<number | null>(null);
  idCategoria: WritableSignal<number | null> = signal<number | null>(null);

  generarInformeDisabled: Signal<boolean> = computed((): boolean => {
    return (
      this.informeTipo() === null ||
      this.informeMonth() === null ||
      this.informeYear() === null ||
      (this.informeTipo() === 'ventas' && this.idCategoria() === null)
    );
  });

  ngOnInit(): void {
    this.monthList = this.config.monthList;
    const currentYear: number = new Date().getFullYear();
    this.yearList = Array.from({ length: 5 }, (_, i) => currentYear - i);
  }

  generarInforme(): void {
    if (this.informeTipo() === 'ventas') {
      window.open(
        `/caja/informes/${this.informeTipo()}/${this.idCategoria()}/${this.informeYear()}/${this.informeMonth()}`,
      );
      return;
    }
    window.open(
      `/caja/informes/${this.informeTipo()}/${this.informeYear()}/${this.informeMonth()}`,
    );
  }
}
