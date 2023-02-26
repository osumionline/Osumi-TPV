import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  standalone: true,
  selector: "otpv-alert-dialog",
  templateUrl: "./alert-dialog.component.html",
  styleUrls: [],
  imports: [],
})
export class AlertDialogComponent {
  public title: string;
  public content: string;
  public ok: string;

  constructor(public dialogRef: MatDialogRef<AlertDialogComponent>) {}
}
