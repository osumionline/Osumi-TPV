import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { MaterialModule } from "src/app/modules/material/material.module";

@Component({
  standalone: true,
  selector: "otpv-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
  imports: [MaterialModule],
})
export class ConfirmDialogComponent {
  public title: string;
  public content: string;
  public ok: string;
  public cancel: string;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}
}
