import {
  AfterViewInit,
  Component,
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
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ClientesResult } from '@interfaces/cliente.interface';
import Cliente from '@model/clientes/cliente.model';
import ApiStatusEnum from '@model/enum/api-status.enum';
import { CustomOverlayRef, DialogService } from '@osumi/angular-tools';
import ClassMapperService from '@services/class-mapper.service';
import ClientesService from '@services/clientes.service';

@Component({
  selector: 'otpv-buscar-cliente-modal',
  imports: [MatFormField, MatInput, FormsModule, MatTableModule],
  templateUrl: './buscar-cliente-modal.component.html',
  styleUrl: './buscar-cliente-modal.component.scss',
})
export default class BuscarClienteModalComponent implements OnInit, AfterViewInit {
  private readonly cms: ClassMapperService = inject(ClassMapperService);
  private readonly cs: ClientesService = inject(ClientesService);
  private readonly dialog: DialogService = inject(DialogService);
  private readonly customOverlayRef: CustomOverlayRef<null> = inject(CustomOverlayRef);

  elegirClienteNombre: string = '';
  searchTimer: number | undefined = undefined;
  searching: boolean = false;
  searched: WritableSignal<boolean> = signal<boolean>(false);
  searchResult: WritableSignal<Cliente[]> = signal<Cliente[]>([]);
  buscadorDisplayedColumns: string[] = ['nombreApellidos', 'telefono', 'ultimaVenta'];
  buscadorDataSource: MatTableDataSource<Cliente> = new MatTableDataSource<Cliente>();
  sort: Signal<MatSort> = viewChild.required<MatSort>(MatSort);
  buscarClienteBoxName: Signal<ElementRef> = viewChild.required<ElementRef>('buscarClienteBoxName');

  ngOnInit(): void {
    this.buscarClienteBoxName().nativeElement.focus();
  }

  ngAfterViewInit(): void {
    this.buscadorDataSource.sort = this.sort();
  }

  searchStart(): void {
    clearTimeout(this.searchTimer);
    this.searchTimer = window.setTimeout((): void => {
      this.searchClientes();
    }, 500);
  }

  searchClientes(): void {
    if (this.searching) {
      return;
    }
    this.searchResult.set([]);
    if (this.elegirClienteNombre === null || this.elegirClienteNombre === '') {
      return;
    }
    this.searching = true;
    this.cs.searchClientes(this.elegirClienteNombre).subscribe((result: ClientesResult): void => {
      this.searching = false;
      this.searched.set(true);
      if (result.status === ApiStatusEnum.OK) {
        this.searchResult.set(this.cms.getClientes(result.list));
        this.buscadorDataSource.data = this.searchResult();
      } else {
        this.dialog.alert({
          title: 'Error',
          content: 'Ocurrió un error al buscar los clientes.',
        });
      }
    });
  }

  selectCliente(cliente: Cliente): void {
    console.log(cliente);
    this.customOverlayRef.close(cliente);
  }
}
