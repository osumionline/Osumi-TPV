import { Component, ElementRef, inject, OnInit, Signal, viewChild } from '@angular/core';
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
import { MatActionList, MatListItem } from '@angular/material/list';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { IdSaveResult, StatusResult } from '@interfaces/interfaces';
import { SelectMarcaInterface } from '@interfaces/marca.interface';
import { ComercialInterface, ProveedorInterface } from '@interfaces/proveedor.interface';
import Comercial from '@model/proveedores/comercial.model';
import Proveedor from '@model/proveedores/proveedor.model';
import { DialogService } from '@osumi/angular-tools';
import MarcasService from '@services/marcas.service';
import ProveedoresService from '@services/proveedores.service';
import ProviderBrandListFilterPipe from '@shared/pipes/provider-brand-list-filter.pipe';
import ProviderListFilterPipe from '@shared/pipes/provider-list-filter.pipe';

@Component({
  selector: 'otpv-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ProviderBrandListFilterPipe,
    ProviderListFilterPipe,
    MatCard,
    MatCardContent,
    MatFormField,
    MatInput,
    MatActionList,
    MatListItem,
    MatButton,
    MatIcon,
    MatTabGroup,
    MatTab,
    MatSelect,
    MatOption,
    MatCheckbox,
  ],
})
export default class ProveedoresComponent implements OnInit {
  public ps: ProveedoresService = inject(ProveedoresService);
  private ms: MarcasService = inject(MarcasService);
  private dialog: DialogService = inject(DialogService);

  search: string = '';
  searchBox: Signal<ElementRef> = viewChild.required<ElementRef>('searchBox');
  start: boolean = true;
  selectedProveedor: Proveedor = new Proveedor();
  proveedorTabs: Signal<MatTabGroup> = viewChild.required<MatTabGroup>('proveedorTabs');
  selectedTab: number = 0;

  searchMarcas: string = '';
  searchMarcasBox: Signal<ElementRef> = viewChild.required<ElementRef>('searchMarcasBox');
  marcasList: SelectMarcaInterface[] = [];

  nameBox: Signal<ElementRef> = viewChild.required<ElementRef>('nameBox');

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl(null, Validators.required),
    direccion: new FormControl(null),
    telefono: new FormControl(null),
    email: new FormControl(null),
    web: new FormControl(null),
    observaciones: new FormControl(null),
  });
  originalValue: ProveedorInterface | null = null;

  logo: string = '/img/default.jpg';

  selectedComercialId: number = -1;
  showComercial: boolean = false;
  formComercial: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl(null, Validators.required),
    telefono: new FormControl(null),
    email: new FormControl(null),
    observaciones: new FormControl(null),
  });
  originalComercialValue: ComercialInterface | null = null;
  comercialNameBox: Signal<ElementRef> = viewChild.required<ElementRef>('comercialNameBox');
  selectedComercial: Comercial = new Comercial();
  canSeeStatistics: boolean = false;

  ngOnInit(): void {
    for (const marca of this.ms.marcas()) {
      this.marcasList.push({
        id: marca.id as number,
        nombre: marca.nombre as string,
        selected: false,
      });
    }
  }

  searchFocus(): void {
    setTimeout((): void => {
      this.searchBox().nativeElement.focus();
    }, 100);
  }

  selectProveedor(proveedor: Proveedor): void {
    this.start = false;
    this.selectedProveedor = proveedor;
    this.form.patchValue(this.selectedProveedor.toInterface(false));
    this.originalValue = this.form.getRawValue();
    this.proveedorTabs().realignInkBar();
    this.updateMarcasList();
    setTimeout((): void => {
      this.nameBox().nativeElement.focus();
    }, 0);
  }

  newProveedor(): void {
    this.start = false;
    this.selectedProveedor = new Proveedor();
    this.form.patchValue(this.selectedProveedor.toInterface(false));
    this.originalValue = this.form.getRawValue();
    this.proveedorTabs().realignInkBar();
    this.updateMarcasList();
    setTimeout((): void => {
      this.nameBox().nativeElement.focus();
    }, 0);
  }

  updateMarcasList(): void {
    for (const marca of this.marcasList) {
      marca.selected = false;
      if (this.selectedProveedor.marcas.includes(marca.id)) {
        marca.selected = true;
      }
    }
  }

  resetForm(): void {
    this.form.reset();
    this.form.patchValue(this.selectedProveedor.toInterface(false));
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
    const data: ProveedorInterface = JSON.parse(JSON.stringify(this.form.value));
    data.foto = this.logo;
    this.selectedProveedor.fromInterface(data, null, false);

    const proveedorMarcasList: number[] = [];
    for (const marca of this.marcasList) {
      if (marca.selected) {
        proveedorMarcasList.push(marca.id);
      }
    }
    this.selectedProveedor.marcas = proveedorMarcasList;
    data.marcas = this.selectedProveedor.marcas;
    this.ps.saveProveedor(data).subscribe((result: IdSaveResult): void => {
      this.selectedProveedor.id = result.id;
      this.ps.resetProveedores();
      this.resetForm();
      this.dialog.alert({
        title: 'Datos guardados',
        content:
          'Los datos del proveedor "' +
          this.selectedProveedor.nombre +
          '" han sido correctamente guardados.',
      });
    });
  }

  deleteProveedor(): void {
    this.dialog
      .confirm({
        title: 'Confirmar',
        content:
          '¿Estás seguro de querer borrar el proveedor "' +
          this.selectedProveedor.nombre +
          '"? Las marcas asociadas al proveedor no se borrarán, pero si se borrarán sus comerciales asociados.',
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.confirmDeleteProveedor();
        }
      });
  }

  confirmDeleteProveedor(): void {
    this.ps
      .deleteProveedor(this.selectedProveedor.id as number)
      .subscribe((result: StatusResult): void => {
        if (result.status === 'ok') {
          this.ps.resetProveedores();
          this.start = true;
          this.dialog.alert({
            title: 'Proveedor borrado',
            content:
              'El proveedor "' + this.selectedProveedor.nombre + '" ha sido correctamente borrado.',
          });
        } else {
          this.dialog.alert({
            title: 'Error',
            content: 'Ocurrió un error al borrar el proveedor.',
          });
        }
      });
  }

  checkMarcasTab(tab: MatTabChangeEvent): void {
    if (tab.index === 1) {
      setTimeout((): void => {
        this.searchMarcasBox().nativeElement.focus();
      }, 100);
    }
  }

  selectComercial(id: number): void {
    const comercialInd: number = this.selectedProveedor.comerciales.findIndex(
      (x: Comercial): boolean => x.id === id
    );
    this.selectedComercial = new Comercial().fromInterface(
      this.selectedProveedor.comerciales[comercialInd],
      false
    );
    this.formComercial.patchValue(this.selectedComercial.toInterface(false));
    this.originalValue = this.form.getRawValue();
    this.showComercial = true;
    setTimeout((): void => {
      this.comercialNameBox().nativeElement.focus();
    }, 0);
  }

  newComercial(): void {
    this.selectedComercial = new Comercial();
    this.formComercial.patchValue(this.selectedComercial.toInterface(false));
    this.originalComercialValue = this.formComercial.getRawValue();
    this.showComercial = true;
    setTimeout((): void => {
      this.comercialNameBox().nativeElement.focus();
    }, 0);
  }

  resetComercialForm(): void {
    this.formComercial.reset();
    this.formComercial.patchValue(this.selectedComercial.toInterface(false));
  }

  onComercialSubmit(): void {
    const data: ComercialInterface = JSON.parse(JSON.stringify(this.formComercial.value));
    this.selectedComercial.fromInterface(data, false);
    data.idProveedor = this.selectedProveedor.id;
    this.selectedComercial.idProveedor = this.selectedProveedor.id;

    this.ps.saveComercial(data).subscribe((result: IdSaveResult): void => {
      this.selectedComercial.id = result.id;
      this.resetComercialForm();
      this.dialog
        .alert({
          title: 'Datos guardados',
          content:
            'Los datos del comercial "' +
            this.selectedComercial.nombre +
            '" han sido correctamente guardados.',
        })
        .subscribe((): void => {
          this.ps.resetProveedores();
        });
    });
  }

  deleteComercial(): void {
    this.dialog
      .confirm({
        title: 'Confirmar',
        content:
          '¿Estás seguro de querer borrar el comercial "' + this.selectedComercial.nombre + '"?',
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.confirmDeleteComercial();
        }
      });
  }

  confirmDeleteComercial(): void {
    this.ps
      .deleteComercial(this.selectedComercial.id as number)
      .subscribe((result: StatusResult): void => {
        if (result.status === 'ok') {
          this.dialog
            .alert({
              title: 'Comercial borrado',
              content:
                'El comercial "' +
                this.selectedComercial.nombre +
                '" ha sido correctamente borrado.',
            })
            .subscribe((): void => {
              this.ps.resetProveedores();
              this.showComercial = false;
            });
        } else {
          this.dialog.alert({
            title: 'Error',
            content: 'Ocurrió un error al borrar el comercial.',
          });
        }
      });
  }
}
