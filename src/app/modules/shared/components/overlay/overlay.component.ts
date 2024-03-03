import { NgComponentOutlet } from "@angular/common";
import { Component, OnInit, Renderer2, Type } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { Modal } from "src/app/interfaces/modals.interface";
import { CustomOverlayRef } from "src/app/model/tpv/custom-overlay-ref.model";

@Component({
  standalone: true,
  selector: "otpv-overlay",
  templateUrl: "./overlay.component.html",
  styleUrls: ["./overlay.component.scss"],
  imports: [MatIcon, NgComponentOutlet],
})
export class OverlayComponent implements OnInit {
  content: Type<any> = this.customOverlayRef.content;
  inputData: Modal = { modalTitle: "", modalColor: "blue" };

  constructor(
    private customOverlayRef: CustomOverlayRef<any, Modal>,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.listenToEscKey();
    this.inputData = this.customOverlayRef.data;
  }

  private listenToEscKey(): void {
    this.renderer.listen("window", "keyup", (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        this.close();
      }
    });
  }

  close(): void {
    this.customOverlayRef.close(null);
  }
}
