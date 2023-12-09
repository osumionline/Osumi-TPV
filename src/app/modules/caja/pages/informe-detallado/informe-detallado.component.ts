import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { InformeMensualResult } from "src/app/interfaces/informes.interface";
import { InformesService } from "src/app/services/informes.service";

@Component({
  standalone: true,
  selector: "otpv-informe-detallado",
  templateUrl: "./informe-detallado.component.html",
  styleUrls: ["./informe-detallado.component.scss"],
})
export default class InformeDetalladoComponent implements OnInit {
  loaded: boolean = false;
  year: number = null;
  month: number = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private is: InformesService
  ) {
    document.body.classList.add("white-bg");
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.month = parseInt(params.month);
      this.year = parseInt(params.year);
      this.is
        .getInformeDetallado(this.month, this.year)
        .subscribe((result: InformeMensualResult): void => {
          console.log(result);
        });
    });
  }
}
