import { Component }    from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogField }  from '../../../interfaces/interfaces';

@Component({
  selector: 'otpv-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['../css/dialog.component.css']
})
export class FormDialogComponent {
    public title: string;
    public content: string;
	public fields: DialogField[];
    public ok: string;
    public cancel: string;

    constructor(public dialogRef: MatDialogRef<FormDialogComponent>) {}
}
