import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DialogOptions } from "@interfaces/interfaces";
import { AlertDialogComponent } from "@shared/components/dialogs/alert-dialog/alert-dialog.component";
import { ConfirmDialogComponent } from "@shared/components/dialogs/confirm-dialog/confirm-dialog.component";
import { FormDialogComponent } from "@shared/components/dialogs/form-dialog/form-dialog.component";
import { Observable } from "rxjs";

@Injectable()
export class DialogService {
  constructor(private dialog: MatDialog) {}

  public confirm(options: DialogOptions): Observable<boolean> {
    const dialogRef: MatDialogRef<ConfirmDialogComponent> = this.dialog.open(
      ConfirmDialogComponent
    );

    dialogRef.componentInstance.title = options.title;
    dialogRef.componentInstance.content = options.content;
    dialogRef.componentInstance.ok = options.ok;
    dialogRef.componentInstance.cancel = options.cancel;

    return dialogRef.afterClosed();
  }

  public alert(options: DialogOptions): Observable<boolean> {
    const dialogRef: MatDialogRef<AlertDialogComponent> =
      this.dialog.open(AlertDialogComponent);

    dialogRef.componentInstance.title = options.title;
    dialogRef.componentInstance.content = options.content;
    dialogRef.componentInstance.ok = options.ok;

    return dialogRef.afterClosed();
  }

  public form(options: DialogOptions): Observable<DialogOptions> {
    const dialogRef: MatDialogRef<FormDialogComponent> =
      this.dialog.open(FormDialogComponent);

    dialogRef.componentInstance.title = options.title;
    dialogRef.componentInstance.content = options.content;
    dialogRef.componentInstance.ok = options.ok;
    dialogRef.componentInstance.cancel = options.cancel;
    dialogRef.componentInstance.fields = options.fields;

    return dialogRef.afterClosed();
  }
}
