import { Component, inject, ViewChild } from '@angular/core';
import { CustomOverlayRef } from '@osumi/angular-tools';
import CajaContentComponent from '@shared/components/caja/caja-content/caja-content.component';

@Component({
  selector: 'otpv-caja-modal',
  templateUrl: './caja-modal.component.html',
  styleUrls: ['./caja-modal.component.scss'],
  imports: [CajaContentComponent],
})
export default class CajaModalComponent {
  private customOverlayRef: CustomOverlayRef<null, { option: string }> =
    inject(CustomOverlayRef);

  @ViewChild('cajaContent', { static: false })
  cajaContent: CajaContentComponent;

  abrirCaja(): void {
    this.cajaContent.selectTab(this.customOverlayRef.data.option);
  }

  cerrarCaja(): void {
    this.customOverlayRef.close();
  }
}
