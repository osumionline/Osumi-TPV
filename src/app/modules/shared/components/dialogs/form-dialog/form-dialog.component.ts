import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { DialogField } from '@interfaces/interfaces';

@Component({
  standalone: true,
  selector: 'otpv-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  imports: [
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatFormField,
    MatLabel,
    MatHint,
    MatInput,
    MatButton,
  ],
})
export default class FormDialogComponent {
  public dialogRef: MatDialogRef<FormDialogComponent> = inject(MatDialogRef);

  public title: WritableSignal<string> = signal<string>('');
  public content: WritableSignal<string> = signal<string>('');
  public fields: WritableSignal<DialogField[]> = signal<DialogField[]>([]);
  public ok: WritableSignal<string> = signal<string>('');
  public cancel: WritableSignal<string> = signal<string>('');
}
