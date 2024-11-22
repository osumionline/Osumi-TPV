import { NgClass } from '@angular/common';
import {
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import Articulo from '@model/articulos/articulo.model';

@Component({
  selector: 'otpv-articulos-tabs',
  templateUrl: './articulos-tabs.component.html',
  styleUrls: ['./articulos-tabs.component.scss'],
  imports: [NgClass, MatIcon, MatTooltip],
})
export default class ArticulosTabsComponent {
  articulos: InputSignal<Articulo[]> = input.required<Articulo[]>();
  selected: InputSignal<number> = input.required<number>();
  changeSelectedTabEvent: OutputEmitterRef<number> = output<number>();
  createNewTabEvent: OutputEmitterRef<void> = output<void>();
  closeTabEvent: OutputEmitterRef<number> = output<number>();

  selectTab(ind: number): void {
    this.changeSelectedTabEvent.emit(ind);
  }

  closeTab(ind: number): void {
    this.closeTabEvent.emit(ind);
  }

  newTab(): void {
    this.createNewTabEvent.emit();
  }
}
