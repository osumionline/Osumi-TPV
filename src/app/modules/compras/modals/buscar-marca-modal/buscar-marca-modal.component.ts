import {
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
  Signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { BuscarMarcaModalResult } from '@interfaces/modals.interface';
import Marca from '@model/marcas/marca.model';
import { CustomOverlayRef, Modal } from '@osumi/angular-tools';
import MarcasService from '@services/marcas.service';

@Component({
  selector: 'otpv-buscar-marca-modal',
  imports: [MatFormField, MatInput, FormsModule],
  templateUrl: './buscar-marca-modal.component.html',
  styleUrl: './buscar-marca-modal.component.scss',
})
export default class BuscarMarcaModalComponent implements OnInit {
  private readonly ms: MarcasService = inject(MarcasService);
  private readonly customOverlayRef: CustomOverlayRef<BuscarMarcaModalResult, Modal> =
    inject(CustomOverlayRef);

  marcas: WritableSignal<Marca[]> = signal<Marca[]>([...this.ms.marcas()]);
  search: WritableSignal<string> = signal<string>('');
  buscarMarcaBoxName: Signal<ElementRef> = viewChild.required<ElementRef>('buscarMarcaBoxName');

  filteredMarcas: Signal<Marca[]> = computed<Marca[]>((): Marca[] => {
    const term: string = (this.search() || '').trim().toLowerCase();
    if (!term) {
      return this.marcas();
    }

    return this.marcas().filter((m: Marca): boolean => {
      const nombre: string = m?.nombre ?? '';
      return nombre.toLowerCase().includes(term);
    });
  });

  ngOnInit(): void {
    this.buscarMarcaBoxName().nativeElement.focus();
  }

  selectMarca(marca: Marca): void {
    this.customOverlayRef.close({ marca });
  }
}
