import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";

@Component({
  standalone: true,
  selector: "otpv-alert-dialog",
  templateUrl: "./alert-dialog.component.html",
  imports: [MatDialogModule, MatButtonModule],
})
export class AlertDialogComponent {
  public title: string;
  public content: string;
  public ok: string;

  constructor(public dialogRef: MatDialogRef<AlertDialogComponent>) {}
}
