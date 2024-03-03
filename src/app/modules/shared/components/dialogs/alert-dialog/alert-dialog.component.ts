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
  selector: "otpv-alert-dialog",
  templateUrl: "./alert-dialog.component.html",
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton],
})
export class AlertDialogComponent {
  public title: string;
  public content: string;
  public ok: string;

  constructor(public dialogRef: MatDialogRef<AlertDialogComponent>) {}
}
