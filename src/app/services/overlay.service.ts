import { Overlay, OverlayConfig } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { Injectable, Injector, Type } from "@angular/core";
import { Modal } from "src/app/interfaces/modals.interface";
import { CustomOverlayRef } from "src/app/model/custom-overlay-ref.model";
import { OverlayComponent } from "src/app/shared/overlay/overlay.component";

@Injectable({
  providedIn: "root",
})
export class OverlayService {
  constructor(private overlay: Overlay, private injector: Injector) {}

  open<R = any>(
    content: Type<any>,
    data: Modal,
    panelCssClasses: string[] = [],
    closeOnBackdropCLick: boolean = true
  ): CustomOverlayRef<R> {
    const _panelCssClasses: string[] = ["modal-panel", "is-active"].concat(
      panelCssClasses
    );
    const config = new OverlayConfig({
      hasBackdrop: true,
      panelClass: _panelCssClasses,
      backdropClass: "modal-background",
      width: "100%",
      height: "100%",
    });

    const overlayRef = this.overlay.create(config);

    const customOverlayRef = new CustomOverlayRef(
      overlayRef,
      content,
      data,
      closeOnBackdropCLick
    );
    const injector = this.createInjector(customOverlayRef, this.injector);
    overlayRef.attach(new ComponentPortal(OverlayComponent, null, injector));

    return customOverlayRef;
  }

  private createInjector(ref: CustomOverlayRef, inj: Injector): Injector {
    return Injector.create({
      providers: [{ provide: CustomOverlayRef, useValue: ref }],
      parent: inj,
    });
  }
}
