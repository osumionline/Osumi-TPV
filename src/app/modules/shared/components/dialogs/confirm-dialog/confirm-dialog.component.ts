import { Component } from "@angular/core";
import { MatButton } from "@angular/material/button";
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from "@angular/material/dialog";

@Component({
  standalone: true,
  selector: "otpv-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton],
})
export class ConfirmDialogComponent {
  public title: string;
  public content: string;
  public ok: string;
  public cancel: string;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}
}
