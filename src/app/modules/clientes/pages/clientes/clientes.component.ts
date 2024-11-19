import { NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatActionList, MatListItem } from '@angular/material/list';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Params } from '@angular/router';
import { ChartSelectInterface } from '@interfaces/articulo.interface';
import { ClienteSaveResult } from '@interfaces/cliente.interface';
import { Month, StatusResult } from '@interfaces/interfaces';
import { FacturaModal } from '@interfaces/modals.interface';
import Cliente from '@model/clientes/cliente.model';
import Factura from '@model/clientes/factura.model';
import EditFacturaModalComponent from '@modules/clientes/components/modals/edit-factura-modal/edit-factura-modal.component';
import { DialogService, OverlayService } from '@osumi/angular-tools';
import ClassMapperService from '@services/class-mapper.service';
import ClientesService from '@services/clientes.service';
import ConfigService from '@services/config.service';
import HeaderComponent from '@shared/components/header/header.component';
import ClientListFilterPipe from '@shared/pipes/client-list-filter.pipe';
import FixedNumberPipe from '@shared/pipes/fixed-number.pipe';

@Component({
  standalone: true,
  selector: 'otpv-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
  imports: [
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    MatSortModule,
    FixedNumberPipe,
    ClientListFilterPipe,
    HeaderComponent,
    MatCard,
    MatCardContent,
    MatFormField,
    MatInput,
    MatButton,
    MatIconButton,
    MatIcon,
    MatActionList,
    MatListItem,
    MatTabGroup,
    MatTab,
    MatSelect,
    MatOption,
    MatTableModule,
    MatCheckbox,
  ],
})
export default class ClientesComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  public cs: ClientesService = inject(ClientesService);
  public config: ConfigService = inject(ConfigService);
  private dialog: DialogService = inject(DialogService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private overlayService: OverlayService = inject(OverlayService);

  broadcastChannel: BroadcastChannel = new BroadcastChannel('cliente-facturas');
  search: string = '';
  @ViewChild('searchBox', { static: true }) searchBox: ElementRef;
  start: boolean = true;
  @ViewChild('clienteTabs', { static: true })
  clienteTabs: MatTabGroup;
  selectedIndex: number = 0;
  selectedClient: Cliente = new Cliente();
  @ViewChild('nameBox', { static: true }) nameBox: ElementRef;
  @ViewChild('emailBox', { static: true }) emailBox: ElementRef;
  focusEmail: boolean = false;

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombreApellidos: new FormControl(null, Validators.required),
    dniCif: new FormControl(null),
    telefono: new FormControl(null),
    email: new FormControl(null),
    direccion: new FormControl(null),
    codigoPostal: new FormControl(null),
    poblacion: new FormControl(null),
    provincia: new FormControl(null),
    factIgual: new FormControl(true),
    factNombreApellidos: new FormControl(null),
    factDniCif: new FormControl(null),
    factTelefono: new FormControl(null),
    factEmail: new FormControl(null),
    factDireccion: new FormControl(null),
    factCodigoPostal: new FormControl(null),
    factPoblacion: new FormControl(null),
    factProvincia: new FormControl(null),
    observaciones: new FormControl(null),
    descuento: new FormControl(0),
  });

  facturasDisplayedColumns: string[] = ['id', 'fecha', 'importe', 'opciones'];
  facturasDataSource: MatTableDataSource<Factura> =
    new MatTableDataSource<Factura>();
  @ViewChild('facturasTable', { static: false })
  facturasTable!: MatTable<Factura>;

  stats: ChartSelectInterface = {
    data: 'consumo',
    type: 'units',
    month: -1,
    year: -1,
  };
  monthList: Month[] = [];
  yearList: number[] = [];

  ngOnInit(): void {
    this.monthList = this.config.monthList;
    const d = new Date();
    for (let y: number = d.getFullYear() - 5; y <= d.getFullYear(); y++) {
      this.yearList.push(y);
    }
    this.broadcastChannel.onmessage = (message) => {
      if (
        message.data.type === 'imprimir' &&
        message.data.id === this.selectedClient.id
      ) {
        this.loadFacturasCliente();
      }
    };
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.new) {
        if (params.new === 'new') {
          this.newCliente();
        } else {
          const ind: number = this.cs
            .clientes()
            .findIndex((x: Cliente): boolean => {
              return x.id === parseInt(params.new);
            });
          this.focusEmail = true;
          this.selectCliente(this.cs.clientes()[ind]);
        }
      } else {
        this.searchBox.nativeElement.focus();
      }
    });
  }

  selectCliente(cliente: Cliente): void {
    this.start = false;
    this.selectedClient = cliente;
    this.form.patchValue(this.selectedClient.toInterface(false));
    this.selectedIndex = 0;
    this.clienteTabs.realignInkBar();
    this.cs
      .getEstadisticasCliente(this.selectedClient.id)
      .subscribe((result) => {
        if (result.status === 'ok') {
          this.selectedClient.ultimasVentas = this.cms.getUltimaVentaArticulos(
            result.ultimasVentas
          );
          this.selectedClient.topVentas = this.cms.getTopVentaArticulos(
            result.topVentas
          );
        }
      });
    this.loadFacturasCliente();
    setTimeout(() => {
      if (!this.focusEmail) {
        this.nameBox.nativeElement.focus();
      } else {
        this.focusEmail = false;
        this.emailBox.nativeElement.focus();
      }
    });
  }

  loadFacturasCliente(): void {
    this.selectedClient.facturas = [];
    this.facturasDataSource.data = this.selectedClient.facturas;
    this.cs.getFacturas(this.selectedClient.id).subscribe((result) => {
      if (result.status === 'ok') {
        this.selectedClient.facturas = this.cms.getFacturas(result.list);
        const facturas: Factura[] = [...this.selectedClient.facturas];
        this.facturasDataSource.data = facturas;
        this.facturasDataSource.connect().next(facturas);
        this.facturasTable.renderRows();
      }
    });
  }

  newCliente(): void {
    this.start = false;
    this.selectedClient = new Cliente();
    this.form.patchValue(this.selectedClient.toInterface(false));
    this.selectedIndex = 0;
    this.clienteTabs.realignInkBar();
    setTimeout((): void => {
      this.nameBox.nativeElement.focus();
    });
  }

  resetForm(): void {
    this.form.reset();
    this.form.patchValue(this.selectedClient.toInterface(false));
  }

  onSubmit(): void {
    this.selectedClient.fromInterface(this.form.value, false);
    this.cs
      .saveCliente(this.selectedClient.toInterface())
      .subscribe((result: ClienteSaveResult): void => {
        if (result.status === 'ok') {
          this.cs.resetClientes();
          this.resetForm();
          this.dialog.alert({
            title: 'Datos guardados',
            content:
              'Los datos del cliente "' +
              this.selectedClient.nombreApellidos +
              '" han sido correctamente guardados.',
          });
        } else {
          this.dialog.alert({
            title: 'Error',
            content: 'Ocurrió un error al guardar los datos del cliente.',
          });
        }
      });
  }

  deleteCliente(): void {
    this.dialog
      .confirm({
        title: 'Confirmar',
        content:
          '¿Estás seguro de querer borrar el cliente "' +
          this.selectedClient.nombreApellidos +
          '"? Las ventas realizadas al cliente no se borrarán, se borrarán los datos del cliente y que dichas ventas fueron realizadas por él',
      })
      .subscribe((result) => {
        if (result === true) {
          this.confirmDeleteCliente();
        }
      });
  }

  confirmDeleteCliente(): void {
    this.cs
      .deleteCliente(this.selectedClient.id)
      .subscribe((result: StatusResult): void => {
        if (result.status === 'ok') {
          this.cs.resetClientes();
          this.start = true;
          this.dialog.alert({
            title: 'Cliente borrado',
            content:
              'El cliente "' +
              this.selectedClient.nombreApellidos +
              '" ha sido correctamente borrado.',
          });
        } else {
          this.dialog.alert({
            title: 'Error',
            content: 'Ocurrió un error al borrar el cliente.',
          });
        }
      });
  }

  imprimirLOPD(): void {
    window.open('/clientes/lopd/' + this.selectedClient.id);
  }

  nuevaFactura(): void {
    if (
      this.selectedClient.dniCif === null ||
      this.selectedClient.dniCif === ''
    ) {
      this.dialog.alert({
        title: 'Error',
        content:
          'El cliente "' +
          this.selectedClient.nombreApellidos +
          '" no tiene DNI/CIF introducido por lo que no se le puede crear una factura.',
      });
    } else {
      if (
        this.selectedClient.direccion === null ||
        this.selectedClient.direccion === '' ||
        this.selectedClient.codigoPostal === null ||
        this.selectedClient.codigoPostal === '' ||
        this.selectedClient.poblacion === null ||
        this.selectedClient.poblacion === '' ||
        this.selectedClient.provincia === null
      ) {
        this.dialog
          .confirm({
            title: 'Confirmar',
            content:
              'El cliente "' +
              this.selectedClient.nombreApellidos +
              '" no tiene una dirección completa introducida. ¿Quieres continuar?',
          })
          .subscribe((result: boolean): void => {
            if (result === true) {
              this.openNuevaFactura(this.selectedClient);
            }
          });
      } else {
        this.openNuevaFactura(this.selectedClient);
      }
    }
  }

  openNuevaFactura(cliente: Cliente): void {
    const modalnewProveedorData: FacturaModal = {
      modalTitle: 'Nueva factura',
      modalColor: 'blue',
      css: 'modal-wide',
      id: cliente.id,
      factura: null,
    };
    const dialog = this.overlayService.open(
      EditFacturaModalComponent,
      modalnewProveedorData
    );
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data !== null) {
        this.loadFacturasCliente();
      }
    });
  }

  selectFactura(ind: number): void {
    const modalnewProveedorData: FacturaModal = {
      modalTitle: 'Factura ' + this.facturasDataSource.data[ind].id,
      modalColor: 'blue',
      css: 'modal-wide',
      id: null,
      factura: this.facturasDataSource.data[ind],
    };
    const dialog = this.overlayService.open(
      EditFacturaModalComponent,
      modalnewProveedorData
    );
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data !== null) {
        this.loadFacturasCliente();
      }
    });
  }

  enviarFactura(ev: MouseEvent, factura: Factura): void {
    ev && ev.stopPropagation();
    this.dialog
      .confirm({
        title: 'Confirmar',
        content:
          '¿Estás seguro de querer enviar la factura "' +
          factura.id +
          '" al cliente "' +
          this.selectedClient.nombreApellidos +
          ' (' +
          this.selectedClient.email +
          ')"?',
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.confirmEnviarFactura(factura.id);
        }
      });
  }

  confirmEnviarFactura(id: number): void {
    this.cs.sendFactura(id).subscribe((result: StatusResult): void => {
      if (result.status === 'ok') {
        this.dialog.alert({
          title: 'Factura enviada',
          content: 'La factura ha sido correctamente enviada.',
        });
      } else {
        this.dialog.alert({
          title: 'Error',
          content:
            'Ocurrió un error al intentar enviar la factura a la dirección "' +
            this.selectedClient.email +
            '".',
        });
      }
    });
  }

  imprimirFactura(ev: MouseEvent, factura: Factura): void {
    ev && ev.stopPropagation();
    window.open('/clientes/factura/' + factura.id);
  }
}
