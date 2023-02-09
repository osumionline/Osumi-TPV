import { Component, OnInit } from "@angular/core";
import { ArticulosService } from "src/app/services/articulos.service";

@Component({
  selector: "otpv-articulos",
  templateUrl: "./articulos.component.html",
  styleUrls: ["./articulos.component.scss"],
})
export class ArticulosComponent implements OnInit {
  constructor(public ars: ArticulosService) {}

  ngOnInit(): void {
    if (this.ars.list.length === 0) {
      this.ars.newArticulo();
    }
  }
}
