import { Component, ModelSignal, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import Articulo from '@model/articulos/articulo.model';
import Foto from '@model/articulos/foto.model';
import ApiStatusEnum from '@model/enum/api-status.enum';
import { DialogService } from '@osumi/angular-tools';

@Component({
  selector: 'otpv-un-articulo-web',
  imports: [MatSlideToggle, MatFormField, MatInput, FormsModule, MatIcon, MatButton],
  templateUrl: './un-articulo-web.component.html',
  styleUrl: '../un-articulo/un-articulo.component.scss',
})
export default class UnArticuloWebComponent {
  private readonly dialog: DialogService = inject(DialogService);

  articulo: ModelSignal<Articulo> = model.required<Articulo>();

  addFoto(): void {
    const obj: HTMLElement | null = document.getElementById('foto-file');
    if (obj !== null) {
      obj.click();
    }
  }

  onFotoChange(ev: Event): void {
    const reader: FileReader = new FileReader();
    const files: FileList | null = (ev.target as HTMLInputElement).files;
    if (files !== null && files.length > 0) {
      const file = files[0];
      reader.readAsDataURL(file);
      reader.onload = (): void => {
        const foto: Foto = new Foto();
        foto.load(reader.result as string);
        this.articulo.update((value: Articulo): Articulo => {
          value.fotosList.push(foto);
          return value;
        });
        (document.getElementById('foto-file') as HTMLInputElement).value = '';
      };
    }
  }

  deleteFoto(i: number): void {
    this.dialog
      .confirm({
        title: 'Confirmar',
        content: '¿Estás seguro de querer borrar esta foto?',
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.articulo.update((value: Articulo): Articulo => {
            if (value.fotosList[i].status === ApiStatusEnum.OK) {
              value.fotosList[i].status = 'deleted';
            }
            if (value.fotosList[i].status === ApiStatusEnum.NEW) {
              value.fotosList.splice(i, 1);
            }
            return value;
          });
        }
      });
  }

  moveFoto(sent: string, i: number): void {
    let aux: Foto | null = null;
    if (sent === 'left') {
      if (i === 0) {
        return;
      }
      this.articulo.update((value: Articulo): Articulo => {
        aux = value.fotosList[i];
        value.fotosList[i] = value.fotosList[i - 1];
        value.fotosList[i - 1] = aux;
        return value;
      });
    } else {
      if (i === this.articulo().fotosList.length - 1) {
        return;
      }
      this.articulo.update((value: Articulo): Articulo => {
        aux = value.fotosList[i];
        value.fotosList[i] = value.fotosList[i + 1];
        value.fotosList[i + 1] = aux;
        return value;
      });
    }
  }
}
