import { Component } from "@angular/core";
import { CustomOverlayRef } from "src/app/model/custom-overlay-ref.model";

@Component({
  selector: "otpv-reservas-modal",
  templateUrl: "./reservas-modal.component.html",
  styleUrls: ["./reservas-modal.component.scss"],
})
export class ReservasModalComponent {
  constructor(private customOverlayRef: CustomOverlayRef<null, {}>) {}
}
