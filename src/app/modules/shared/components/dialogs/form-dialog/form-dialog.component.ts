import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { DialogField } from "src/app/interfaces/interfaces";
import { MaterialModule } from "src/app/modules/material/material.module";
import { FormsModule } from "@angular/forms";

@Component({
  standalone: true,
  selector: "otpv-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: [],
  imports: [
    MaterialModule,
    FormsModule
  ],
})
export class FormDialogComponent {
  public title: string;
  public content: string;
  public fields: DialogField[];
  public ok: string;
  public cancel: string;

  constructor(public dialogRef: MatDialogRef<FormDialogComponent>) {}
}
