import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";

@Component({
  standalone: true,
  selector: "otpv-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
  imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmDialogComponent {
  public title: string;
  public content: string;
  public ok: string;
  public cancel: string;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}
}
