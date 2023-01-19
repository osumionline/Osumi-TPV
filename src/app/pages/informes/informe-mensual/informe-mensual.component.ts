import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { InformeMensualItemInterface } from "src/app/interfaces/informes.interface";
import { InformesService } from "src/app/services/informes.service";

@Component({
  selector: "otpv-informe-mensual",
  templateUrl: "./informe-mensual.component.html",
  styleUrls: ["./informe-mensual.component.scss"],
})
export class InformeMensualComponent implements OnInit {
  year: number = null;
  month: number = null;
  list: InformeMensualItemInterface[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private is: InformesService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      console.log(params);
      this.month = parseInt(params.month);
      this.year = parseInt(params.year);
      this.is.getInformeMensual(this.month, this.year).subscribe((result) => {
        this.list = result.list;
        console.log(this.list);
        this.checkOtros();
      });
    });
  }

  checkOtros(): void {
    const otros: string[] = [];
    for (let item of this.list) {
      for (let otro of item.otros) {
        if (!otros.includes(otro.nombre)) {
          otros.push(otro.nombre);
        }
      }
    }
    otros.sort();
    console.log(otros);
  }
}
