import { Component, OnInit } from "@angular/core";
import { CustomOverlayRef } from "src/app/model/custom-overlay-ref.model";

@Component({
  selector: "otpv-margenes",
  templateUrl: "./margenes.component.html",
  styleUrls: ["./margenes.component.scss"],
})
export class MargenesComponent implements OnInit {
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
