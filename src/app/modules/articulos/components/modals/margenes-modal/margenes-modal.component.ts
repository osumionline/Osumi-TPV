import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { CustomOverlayRef } from '@osumi/angular-tools';
import FixedNumberPipe from '@shared/pipes/fixed-number.pipe';

@Component({
  selector: 'otpv-margenes-modal',
  templateUrl: './margenes-modal.component.html',
  styleUrls: ['./margenes-modal.component.scss'],
  imports: [FixedNumberPipe],
})
export default class MargenesModalComponent implements OnInit {
  private readonly customOverlayRef: CustomOverlayRef<null, { puc: number; list: number[] }> =
    inject(CustomOverlayRef<null, { puc: number; list: number[] }>);

  puc: WritableSignal<number> = signal<number>(0);
  marginList: WritableSignal<number[]> = signal<number[]>([]);

  ngOnInit(): void {
    this.puc.set(this.customOverlayRef.data.puc);
    this.marginList.set(this.customOverlayRef.data.list);
  }

  selectMargen(margin: number): void {
    this.customOverlayRef.close(margin);
  }
}
