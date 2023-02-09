import { Component } from "@angular/core";
import { ArticulosService } from "src/app/services/articulos.service";

@Component({
  selector: "otpv-articulos-tabs",
  templateUrl: "./articulos-tabs.component.html",
  styleUrls: ["./articulos-tabs.component.scss"],
})
export class ArticulosTabsComponent {
  constructor(public ars: ArticulosService) {}

  selectTab(ind: number): void {
    this.ars.selected = ind;
  }

  closeTab(ind: number): void {
    this.ars.list.splice(ind, 1);
    let newInd: number = ind - 1;
    if (this.ars.list.length > 0) {
      this.ars.selected = newInd >= 0 ? newInd : 0;
    } else {
      this.ars.selected = -1;
    }
    for (let ind in this.ars.list) {
      this.ars.list[ind].tabName = "ARTÍCULO " + (parseInt(ind) + 1);
    }
  }

  newTab(): void {
    this.ars.newArticulo();
  }
}
