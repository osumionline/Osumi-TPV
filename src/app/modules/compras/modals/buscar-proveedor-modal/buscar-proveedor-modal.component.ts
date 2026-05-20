import {
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { BuscarProveedorModalResult } from '@app/interfaces/modals.interface';
import Proveedor from '@model/proveedores/proveedor.model';
import { CustomOverlayRef, Modal } from '@osumi/angular-tools';
import ProveedoresService from '@services/proveedores.service';

@Component({
  selector: 'otpv-buscar-proveedor-modal',
  imports: [MatFormField, MatInput, FormsModule],
  templateUrl: './buscar-proveedor-modal.component.html',
  styleUrl: './buscar-proveedor-modal.component.scss',
})
export default class BuscarProveedorModalComponent implements OnInit {
  private readonly ps: ProveedoresService = inject(ProveedoresService);
  private readonly customOverlayRef: CustomOverlayRef<BuscarProveedorModalResult, Modal> =
    inject(CustomOverlayRef);

  proveedores: WritableSignal<Proveedor[]> = signal<Proveedor[]>([...this.ps.proveedores()]);
  search: WritableSignal<string> = signal<string>('');
  buscarProveedorBoxName: Signal<ElementRef> =
    viewChild.required<ElementRef>('buscarProveedorBoxName');

  filteredProveedores: Signal<Proveedor[]> = computed<Proveedor[]>((): Proveedor[] => {
    const term: string = (this.search() || '').trim().toLowerCase();
    if (!term) {
      return this.proveedores();
    }

    return this.proveedores().filter((p: Proveedor): boolean => {
      const nombre: string = p?.nombre ?? '';
      return nombre.toLowerCase().includes(term);
    });
  });

  ngOnInit(): void {
    this.buscarProveedorBoxName().nativeElement.focus();
  }

  selectProveedor(proveedor: Proveedor): void {
    this.customOverlayRef.close({ proveedor });
  }
}
