import { Component }    from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'otpv-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['../css/dialog.component.css']
})
export class AlertDialogComponent {
    public title: string;
    public content: string;
    public ok: string;

    constructor(public dialogRef: MatDialogRef<AlertDialogComponent>) {}
}
