import { Component }    from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './html/confirm-dialog.component.html',
  styleUrls: ['../css/dialog.component.css']
})
export class ConfirmDialogComponent {
    public title: string;
    public content: string;
    public ok: string;
    public cancel: string;

    constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}
}
