import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'otpv-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton],
})
export default class ConfirmDialogComponent {
  public dialogRef: MatDialogRef<ConfirmDialogComponent> = inject(MatDialogRef);

  public title: WritableSignal<string> = signal<string>('');
  public content: WritableSignal<string> = signal<string>('');
  public ok: WritableSignal<string> = signal<string>('');
  public cancel: WritableSignal<string> = signal<string>('');
}
