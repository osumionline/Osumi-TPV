import { CommonModule } from "@angular/common";
import { Component, OnInit, Renderer2, Type } from "@angular/core";
import { Modal } from "src/app/interfaces/modals.interface";
import { CustomOverlayRef } from "src/app/model/tpv/custom-overlay-ref.model";
import { MaterialModule } from "src/app/modules/material/material.module";

@Component({
  standalone: true,
  selector: "app-overlay",
  templateUrl: "./overlay.component.html",
  styleUrls: ["./overlay.component.scss"],
  imports: [CommonModule, MaterialModule],
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
