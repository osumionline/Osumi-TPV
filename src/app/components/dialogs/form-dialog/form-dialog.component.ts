import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { DialogField } from "src/app/interfaces/interfaces";

@Component({
  selector: "otpv-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["../scss/dialog.component.scss"],
})
export class FormDialogComponent {
  public title: string;
  public content: string;
  public fields: DialogField[];
  public ok: string;
  public cancel: string;

  constructor(public dialogRef: MatDialogRef<FormDialogComponent>) {}
}
