import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
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
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatActionList, MatListItem, MatListItemIcon } from '@angular/material/list';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { IdSaveResult, StatusResult } from '@interfaces/interfaces';
import {
  TipoPagoInterface,
  TiposPagoOrderInterface,
  TiposPagoResult,
} from '@interfaces/tipo-pago.interface';
import ApiStatusEnum from '@model/enum/api-status.enum';
import TipoPago from '@model/tpv/tipo-pago.model';
import { DialogService } from '@osumi/angular-tools';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import ConfigService from '@services/config.service';
import GestionService from '@services/gestion.service';
import HeaderComponent from '@shared/components/header/header.component';

@Component({
  selector: 'otpv-gestion-tipos-pago',
  templateUrl: './gestion-tipos-pago.component.html',
  styleUrls: ['./gestion-tipos-pago.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    MatCard,
    MatCardContent,
    MatFormField,
    MatInput,
    MatIcon,
    MatActionList,
    MatListItem,
    MatListItemIcon,
    MatButton,
    MatTabGroup,
    MatTab,
    MatCheckbox,
    DragDropModule,
  ],
})
export default class GestionTiposPagoComponent implements OnInit {
  private readonly config: ConfigService = inject(ConfigService);
  private readonly dialog: DialogService = inject(DialogService);
  private readonly as: ApiService = inject(ApiService);
  private readonly cms: ClassMapperService = inject(ClassMapperService);
  private readonly gs: GestionService = inject(GestionService);
  private readonly router: Router = inject(Router);

  search: WritableSignal<string> = signal<string>('');
  searchBox: Signal<ElementRef> = viewChild.required<ElementRef>('searchBox');
  start: boolean = true;
  selectedTipoPago: TipoPago = new TipoPago();
  tiposPagoTabs: Signal<MatTabGroup> = viewChild.required<MatTabGroup>('tiposPagoTabs');

  tiposPago: WritableSignal<TipoPago[]> = signal<TipoPago[]>([...this.config.tiposPago]);
  filteredTiposPago: Signal<TipoPago[]> = computed<TipoPago[]>((): TipoPago[] => {
    const term: string = (this.search() || '').trim().toLowerCase();
    if (!term) {
      return this.tiposPago();
    }

    return this.tiposPago().filter((tp: TipoPago): boolean => {
      const nombre: string = tp?.nombre ?? '';
      return nombre.toLowerCase().includes(term);
    });
  });

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl(null, Validators.required),
    afectaCaja: new FormControl(false),
    fisico: new FormControl(false),
  });
  originalValue: TipoPagoInterface | null = null;

  logo: string = '/img/default.jpg';

  ngOnInit(): void {
    if (!this.gs.empleado) {
      this.router.navigate(['/gestion']);
      return;
    }
    setTimeout((): void => {
      this.searchBox().nativeElement.focus();
    }, 0);
  }

  onDrop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.config.tiposPago, event.previousIndex, event.currentIndex);
    const orderList: TiposPagoOrderInterface[] = [];
    for (const ind in this.config.tiposPago) {
      const i: number = parseInt(ind);
      this.config.tiposPago[ind].orden = i;
      orderList.push({ id: this.config.tiposPago[ind].id as number, orden: i });
    }
    this.as.saveTipoPagoOrden(orderList).subscribe((result: StatusResult): void => {
      if (result.status === ApiStatusEnum.ERROR) {
        this.dialog.alert({
          title: 'Error',
          content: 'Ocurrió un error al guardar el orden de los tipos de pago.',
        });
      }
    });
  }

  selectTipoPago(tipoPago: TipoPago): void {
    this.start = false;
    this.selectedTipoPago = tipoPago;
    this.form.patchValue(this.selectedTipoPago.toInterface(false));
    this.originalValue = this.form.getRawValue();
    this.tiposPagoTabs().realignInkBar();
    this.logo = this.selectedTipoPago.foto as string;
  }

  newTipoPago(): void {
    this.start = false;
    this.selectedTipoPago = new TipoPago();
    this.form.patchValue(this.selectedTipoPago.toInterface(false));
    this.originalValue = this.form.getRawValue();
    this.tiposPagoTabs().realignInkBar();
    this.logo = '/img/default.jpg';
  }

  resetForm(): void {
    this.form.reset();
    this.form.patchValue(this.selectedTipoPago.toInterface(false));
  }

  addLogo(): void {
    const obj: HTMLElement | null = document.getElementById('logo-file');
    if (obj !== null) {
      obj.click();
    }
  }

  onLogoChange(ev: Event): void {
    const reader: FileReader = new FileReader();
    const files: FileList | null = (ev.target as HTMLInputElement).files;
    if (files !== null && files.length > 0) {
      const file = files[0];
      reader.readAsDataURL(file);
      reader.onload = (): void => {
        this.logo = reader.result as string;
        (document.getElementById('logo-file') as HTMLInputElement).value = '';
      };
    }
  }

  onSubmit(): void {
    if (
      this.selectedTipoPago.id === null &&
      (this.logo === null || this.logo === '' || this.logo === '/img/default.jpg')
    ) {
      this.dialog.alert({
        title: 'Error',
        content: 'No has elegido un logo.',
      });
      return;
    }
    const data: TipoPagoInterface = JSON.parse(JSON.stringify(this.form.value));
    data.foto = this.logo;

    this.selectedTipoPago.fromInterface(data, false);

    this.as.saveTipoPago(data).subscribe((result: IdSaveResult): void => {
      if (result.status === ApiStatusEnum.OK) {
        this.as.loadTiposPago().subscribe((result: TiposPagoResult): void => {
          this.config.tiposPago = this.cms.getTiposPago(result.list);
        });
        this.resetForm();
        this.dialog.alert({
          title: 'Datos guardados',
          content:
            'Los datos del tipo de pago "' +
            this.selectedTipoPago.nombre +
            '" han sido correctamente guardados.',
        });
      } else {
        this.dialog.alert({
          title: 'Error',
          content: 'Ocurrió un error al guardar el tipo de pago.',
        });
      }
    });
  }

  deleteTipoPago(): void {
    this.dialog
      .confirm({
        title: 'Confirmar',
        content:
          '¿Estás seguro de querer borrar el tipo de pago "' +
          this.selectedTipoPago.nombre +
          '"? No se borrarán las ventas de ese tipo de pago, pero dejará de estar disponible para nuevas ventas.',
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.confirmDeleteTipoPago();
        }
      });
  }

  confirmDeleteTipoPago(): void {
    this.as
      .deleteTipoPago(this.selectedTipoPago.id as number)
      .subscribe((result: StatusResult): void => {
        if (result.status === ApiStatusEnum.OK) {
          this.as.loadTiposPago().subscribe((result: TiposPagoResult): void => {
            this.config.tiposPago = this.cms.getTiposPago(result.list);
          });
          this.start = true;
          this.dialog.alert({
            title: 'Tipo de pago borrado',
            content:
              'El tipo de pago "' +
              this.selectedTipoPago.nombre +
              '" ha sido correctamente borrado.',
          });
        } else {
          this.dialog.alert({
            title: 'Error',
            content: 'Ocurrió un error al borrar el tipo de pago.',
          });
        }
      });
  }
}
