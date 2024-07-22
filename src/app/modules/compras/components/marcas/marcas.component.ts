import { NgClass } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatActionList, MatListItem } from '@angular/material/list';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { IdSaveResult, StatusResult } from '@interfaces/interfaces';
import { MarcaInterface } from '@interfaces/marca.interface';
import { Marca } from '@model/marcas/marca.model';
import { DialogService } from '@services/dialog.service';
import { MarcasService } from '@services/marcas.service';
import { BrandListFilterPipe } from '@shared/pipes/brand-list-filter.pipe';

@Component({
  standalone: true,
  selector: 'otpv-marcas',
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.scss'],
  imports: [
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    BrandListFilterPipe,
    MatCard,
    MatCardContent,
    MatFormField,
    MatInput,
    MatActionList,
    MatListItem,
    MatIcon,
    MatButton,
    MatTabGroup,
    MatTab,
  ],
})
export class MarcasComponent {
  search: string = '';
  @ViewChild('searchBox', { static: true }) searchBox: ElementRef;
  start: boolean = true;
  @ViewChild('marcaTabs', { static: false })
  marcaTabs: MatTabGroup;
  selectedMarca: Marca = new Marca();

  @ViewChild('nameBox', { static: true }) nameBox: ElementRef;
  logo: string = '/img/default.jpg';

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl(null, Validators.required),
    direccion: new FormControl(null),
    telefono: new FormControl(null),
    email: new FormControl(null),
    web: new FormControl(null),
    observaciones: new FormControl(null),
  });
  originalValue: MarcaInterface = null;
  canSeeStatistics: boolean = false;

  constructor(public ms: MarcasService, private dialog: DialogService) {}

  searchFocus(): void {
    setTimeout((): void => {
      this.searchBox.nativeElement.focus();
    }, 100);
  }

  selectMarca(marca: Marca): void {
    this.start = false;
    this.selectedMarca = marca;
    this.form.patchValue(this.selectedMarca.toInterface(false));
    this.originalValue = this.form.getRawValue();
    this.logo = marca.foto || '/img/default.jpg';
    this.marcaTabs.realignInkBar();
    setTimeout((): void => {
      this.nameBox.nativeElement.focus();
    }, 0);
  }

  newMarca(): void {
    this.start = false;
    this.selectedMarca = new Marca();
    this.form.patchValue(this.selectedMarca.toInterface(false));
    this.originalValue = this.form.getRawValue();
    this.logo = '/img/default.jpg';
    this.marcaTabs.realignInkBar();
    setTimeout((): void => {
      this.nameBox.nativeElement.focus();
    }, 0);
  }

  resetForm(): void {
    this.form.reset();
    this.form.patchValue(this.selectedMarca.toInterface(false));
  }

  addLogo(): void {
    document.getElementById('logo-file').click();
  }

  onLogoChange(ev: Event): void {
    const reader: FileReader = new FileReader();
    if (
      (<HTMLInputElement>ev.target).files &&
      (<HTMLInputElement>ev.target).files.length > 0
    ) {
      const file = (<HTMLInputElement>ev.target).files[0];
      reader.readAsDataURL(file);
      reader.onload = (): void => {
        this.logo = reader.result as string;
        (<HTMLInputElement>document.getElementById('logo-file')).value = '';
      };
    }
  }

  onSubmit(): void {
    const data: MarcaInterface = JSON.parse(JSON.stringify(this.form.value));
    data.foto = this.logo;

    this.selectedMarca.fromInterface(data, false);
    this.ms.saveMarca(data).subscribe((result: IdSaveResult): void => {
      if (result.status === 'ok') {
        this.ms.resetMarcas();
        this.resetForm();
        this.dialog.alert({
          title: 'Datos guardados',
          content:
            'Los datos de la marca "' +
            this.selectedMarca.nombre +
            '" han sido correctamente guardados.',
          ok: 'Continuar',
        });
      } else {
        this.dialog.alert({
          title: 'Error',
          content: 'Ocurrió un error al guardar los datos de la marca.',
          ok: 'Continuar',
        });
      }
    });
  }

  deleteMarca(): void {
    this.dialog
      .confirm({
        title: 'Confirmar',
        content:
          '¿Estás seguro de querer borrar la marca "' +
          this.selectedMarca.nombre +
          '"? No se borrarán los artículos de esa marca, pero todos los artículos de esa marca dejarán de estar disponibles para venta hasta que no se les asigne una marca nueva.',
        ok: 'Continuar',
        cancel: 'Cancelar',
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.confirmDeleteMarca();
        }
      });
  }

  confirmDeleteMarca(): void {
    this.ms
      .deleteMarca(this.selectedMarca.id)
      .subscribe((result: StatusResult): void => {
        if (result.status === 'ok') {
          this.ms.resetMarcas();
          this.start = true;
          this.dialog.alert({
            title: 'Marca borrada',
            content:
              'La marca "' +
              this.selectedMarca.nombre +
              '" ha sido correctamente borrada.',
            ok: 'Continuar',
          });
        } else {
          this.dialog.alert({
            title: 'Error',
            content: 'Ocurrió un error al borrar la marca.',
            ok: 'Continuar',
          });
        }
      });
  }
}
