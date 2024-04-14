import { NgClass } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { MatTooltip } from "@angular/material/tooltip";
import { ArticulosService } from "@services/articulos.service";

@Component({
  standalone: true,
  selector: "otpv-articulos-tabs",
  templateUrl: "./articulos-tabs.component.html",
  styleUrls: ["./articulos-tabs.component.scss"],
  imports: [NgClass, MatIcon, MatTooltip],
})
export class ArticulosTabsComponent {
  ars: ArticulosService = inject(ArticulosService);

  selectTab(ind: number): void {
    this.ars.selected = ind;
  }

  closeTab(ind: number): void {
    this.ars.list.splice(ind, 1);
    const newInd: number = ind - 1;
    if (this.ars.list.length > 0) {
      this.ars.selected = newInd >= 0 ? newInd : 0;
    } else {
      this.ars.selected = -1;
    }
    for (const ind in this.ars.list) {
      this.ars.list[ind].tabName = "ARTÍCULO " + (parseInt(ind) + 1);
    }
  }

  newTab(): void {
    this.ars.newArticulo();
  }
}
