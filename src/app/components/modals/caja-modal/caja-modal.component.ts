import { Component, OnInit, ViewChild } from "@angular/core";
import { CustomOverlayRef } from "src/app/model/tpv/custom-overlay-ref.model";
import { CajaContentComponent } from "src/app/modules/standalone/components/caja/caja-content/caja-content.component";

@Component({
  selector: "otpv-caja-modal",
  templateUrl: "./caja-modal.component.html",
  styleUrls: ["./caja-modal.component.scss"],
})
export class CajaModalComponent implements OnInit {
  @ViewChild("cajaContent", { static: false })
  cajaContent: CajaContentComponent;

  constructor(
    private customOverlayRef: CustomOverlayRef<null, { option: string }>
  ) {}

  ngOnInit(): void {}

  abrirCaja(): void {
    this.cajaContent.selectTab(this.customOverlayRef.data.option);
  }

  cerrarCaja(): void {
    this.customOverlayRef.close();
  }
}
