import { Component, OnInit } from "@angular/core";
import { CustomOverlayRef } from "@model/tpv/custom-overlay-ref.model";
import { FixedNumberPipe } from "@shared/pipes/fixed-number.pipe";

@Component({
  standalone: true,
  selector: "otpv-margenes-modal",
  templateUrl: "./margenes-modal.component.html",
  styleUrls: ["./margenes-modal.component.scss"],
  imports: [FixedNumberPipe],
})
export class MargenesModalComponent implements OnInit {
  puc: number = 0;
  marginList: number[] = [];

  constructor(
    private customOverlayRef: CustomOverlayRef<
      null,
      { puc: number; list: number[] }
    >
  ) {}

  ngOnInit(): void {
    this.puc = this.customOverlayRef.data.puc;
    this.marginList = this.customOverlayRef.data.list;
  }

  selectMargen(margin: number): void {
    this.customOverlayRef.close(margin);
  }
}
