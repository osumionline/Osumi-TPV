import { Component, ElementRef, inject, OnInit, Signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { IdSaveResult } from '@interfaces/interfaces';
import Marca from '@model/marcas/marca.model';
import { CustomOverlayRef, DialogService } from '@osumi/angular-tools';
import MarcasService from '@services/marcas.service';

@Component({
  selector: 'otpv-new-marca-modal',
  templateUrl: './new-marca-modal.component.html',
  imports: [FormsModule, MatFormField, MatInput, MatCheckbox, MatButton],
})
export default class NewMarcaModalComponent implements OnInit {
  private dialog: DialogService = inject(DialogService);
  private ms: MarcasService = inject(MarcasService);
  private customOverlayRef: CustomOverlayRef = inject(CustomOverlayRef);

  nombreBox: Signal<ElementRef> = viewChild.required('nombreBox');
  marca: Marca = new Marca();

  ngOnInit(): void {
    this.nombreBox().nativeElement.focus();
  }

  guardarMarca(): void {
    if (!this.marca.nombre) {
      this.dialog
        .alert({
          title: 'Error',
          content: '¡No puedes dejar el nombre de la marca en blanco!',
        })
        .subscribe((): void => {
          this.nombreBox().nativeElement.focus();
        });
      return;
    }

    this.ms.saveMarca(this.marca.toInterface()).subscribe((result: IdSaveResult): void => {
      if (result.status === 'ok') {
        this.ms.resetMarcas();
        this.customOverlayRef.close(result.id);
      }
      if (result.status === 'error-nombre') {
        this.dialog
          .alert({
            title: 'Error',
            content: 'Ya existe una marca con el nombre indicado.',
          })
          .subscribe((): void => {
            this.nombreBox().nativeElement.focus();
          });
        return;
      }
      if (result.status === 'error') {
        this.dialog.alert({
          title: 'Error',
          content: 'Ocurrió un error al guardar la nueva marca.',
        });
        return;
      }
    });
  }
}
