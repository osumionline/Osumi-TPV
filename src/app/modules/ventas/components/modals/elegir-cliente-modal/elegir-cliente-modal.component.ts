import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  Signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import {
  ClienteSaveResult,
  ClientesResult,
} from '@interfaces/cliente.interface';
import Cliente from '@model/clientes/cliente.model';
import { CustomOverlayRef, DialogService } from '@osumi/angular-tools';
import ClassMapperService from '@services/class-mapper.service';
import ClientesService from '@services/clientes.service';
import ConfigService from '@services/config.service';

@Component({
  selector: 'otpv-elegir-cliente-modal',
  templateUrl: './elegir-cliente-modal.component.html',
  styleUrls: ['./elegir-cliente-modal.component.scss'],
  imports: [
    FormsModule,
    MatSortModule,
    MatTabGroup,
    MatTab,
    MatFormField,
    MatLabel,
    MatInput,
    MatTableModule,
    MatSelect,
    MatOption,
    MatCheckbox,
    MatButton,
  ],
})
export default class ElegirClienteModalComponent
  implements OnInit, AfterViewInit
{
  public config: ConfigService = inject(ConfigService);
  private dialog: DialogService = inject(DialogService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private cs: ClientesService = inject(ClientesService);
  private router: Router = inject(Router);
  private customOverlayRef: CustomOverlayRef<null, { from: string }> =
    inject(CustomOverlayRef);

  selectClienteFrom: string = null;
  elegirClienteTabs: Signal<MatTabGroup> =
    viewChild.required<MatTabGroup>('elegirClienteTabs');
  elegirClienteBoxName: Signal<ElementRef> = viewChild.required<ElementRef>(
    'elegirClienteBoxName'
  );
  elegirClienteSelectedTab: number = 0;
  elegirClienteNombre: string = '';
  searchTimer: number = null;
  searching: boolean = false;
  searched: boolean = false;
  searchResult: Cliente[] = [];

  buscadorDisplayedColumns: string[] = [
    'nombreApellidos',
    'telefono',
    'ultimaVenta',
  ];
  buscadorDataSource: MatTableDataSource<Cliente> =
    new MatTableDataSource<Cliente>();
  sort: Signal<MatSort> = viewChild<MatSort>(MatSort);

  nuevoCliente: Cliente = new Cliente();
  nuevoClienteBoxName: Signal<ElementRef> = viewChild.required<ElementRef>(
    'nuevoClienteBoxName'
  );
  nuevoClienteSaving: boolean = false;

  ngOnInit(): void {
    this.selectClienteFrom = this.customOverlayRef.data.from;
    this.elegirClienteSelectedTab = 0;
    this.elegirClienteNombre = '';
    this.searching = false;
    this.searched = false;
    this.nuevoCliente = new Cliente();
    setTimeout((): void => {
      this.elegirClienteBoxName().nativeElement.focus();
    }, 0);
  }

  ngAfterViewInit(): void {
    this.buscadorDataSource.sort = this.sort();
    this.elegirClienteTabs().realignInkBar();
  }

  changeClienteTab(ev: MatTabChangeEvent): void {
    if (ev.index === 0) {
      this.elegirClienteBoxName().nativeElement.focus();
    }
    if (ev.index === 1) {
      this.nuevoClienteBoxName().nativeElement.focus();
    }
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
    this.searchResult = [];
    if (this.elegirClienteNombre === null || this.elegirClienteNombre === '') {
      return;
    }
    this.searching = true;
    this.cs
      .searchClientes(this.elegirClienteNombre)
      .subscribe((result: ClientesResult): void => {
        this.searching = false;
        this.searched = true;
        if (result.status === 'ok') {
          this.searchResult = this.cms.getClientes(result.list);
          this.buscadorDataSource.data = this.searchResult;
        } else {
          this.dialog.alert({
            title: 'Error',
            content: 'Ocurrió un error al buscar los clientes.',
          });
        }
      });
  }

  selectCliente(cliente: Cliente): void {
    if (
      this.selectClienteFrom === 'venta' &&
      (cliente.email === null || cliente.email === '')
    ) {
      this.dialog
        .confirm({
          title: 'Elegir cliente',
          content:
            'El cliente seleccionado no tiene ningún email asignado. ¿Quieres seleccionar otro cliente o quieres ir a su ficha para poder añadirselo?',
          ok: 'Ir a su ficha',
          cancel: 'Elegir otro cliente',
        })
        .subscribe((result: boolean): void => {
          if (result === true) {
            this.router.navigate(['/clientes/' + cliente.id]);
          }
        });
      return;
    }

    this.customOverlayRef.close(cliente);
  }

  saveNuevoCliente(): void {
    if (
      this.nuevoCliente.nombreApellidos === null ||
      this.nuevoCliente.nombreApellidos === ''
    ) {
      this.dialog
        .alert({
          title: 'Error',
          content: '¡No puedes dejar en blanco el nombre del cliente!',
        })
        .subscribe((): void => {
          this.nuevoClienteBoxName().nativeElement.focus();
        });
      return;
    }
    if (this.nuevoCliente.factIgual) {
      if (
        this.nuevoCliente.nombreApellidos === null ||
        this.nuevoCliente.nombreApellidos === ''
      ) {
        this.dialog.alert({
          title: 'Error',
          content:
            '¡No puedes dejar en blanco el nombre del cliente para la facturación!',
        });
        return;
      }
    }
    this.searching = true;
    this.cs
      .saveCliente(this.nuevoCliente.toInterface())
      .subscribe((result: ClienteSaveResult): void => {
        if (result.status === 'ok') {
          this.cs.resetClientes();
          this.nuevoCliente.id = result.id;
          this.selectCliente(this.nuevoCliente);
          window.open('/clientes/lopd/' + result.id);
        } else {
          this.dialog.alert({
            title: 'Error',
            content: '¡Ocurrió un error al guardar el cliente!',
          });
        }
      });
  }
}
