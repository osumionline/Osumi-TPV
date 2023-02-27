import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { MaterialModule } from "src/app/modules/material/material.module";

@Component({
  standalone: true,
  selector: "otpv-alert-dialog",
  templateUrl: "./alert-dialog.component.html",
  imports: [MaterialModule],
})
export class AlertDialogComponent {
  public title: string;
  public content: string;
  public ok: string;

  constructor(public dialogRef: MatDialogRef<AlertDialogComponent>) {}
}
