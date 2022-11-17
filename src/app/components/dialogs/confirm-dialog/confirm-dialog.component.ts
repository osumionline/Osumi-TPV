import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "otpv-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
  styleUrls: ["../scss/dialog.component.scss"],
})
export class ConfirmDialogComponent {
  public title: string;
  public content: string;
  public ok: string;
  public cancel: string;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}
}
