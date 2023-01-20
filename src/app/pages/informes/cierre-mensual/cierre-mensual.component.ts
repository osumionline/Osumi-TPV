import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Params } from "@angular/router";
import { InformeMensualItem } from "src/app/model/informe-mensual-item.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { InformesService } from "src/app/services/informes.service";

@Component({
  selector: "otpv-cierre-mensual",
  templateUrl: "./cierre-mensual.component.html",
  styleUrls: ["./cierre-mensual.component.scss"],
})
export class CierreMensualComponent implements OnInit {
  loaded: boolean = false;
  year: number = null;
  month: number = null;
  list: InformeMensualItem[] = [];
  otrosList: string[] = [];
  minTicket: number = 999999999;
  maxTicket: number = 0;
  totalEfectivo: number = 0;

  totalTotal: number = 0;
  totalSuma: number = 0;

  informeDisplayedColumns: string[] = ["fecha", "tickets", "efectivo"];
  informeDataSource: MatTableDataSource<InformeMensualItem> =
    new MatTableDataSource<InformeMensualItem>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private is: InformesService,
    private cms: ClassMapperService
  ) {
    document.body.classList.add("white-bg");
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.month = parseInt(params.month);
      this.year = parseInt(params.year);
      this.is
        .getInformeCierreCajaMensual(this.month, this.year)
        .subscribe((result) => {
          this.list = this.cms.getInformeMensualItems(result.list);
          this.checkOtros();
          for (let otro of this.otrosList) {
            this.informeDisplayedColumns.push(otro);
          }
          this.informeDisplayedColumns.push("totalDia");
          this.informeDisplayedColumns.push("suma");
          this.informeDataSource.data = this.list;
          let hasResults: boolean = false;
          for (let item of this.list) {
            if (item.minTicket !== null && item.minTicket < this.minTicket) {
              this.minTicket = item.minTicket;
              hasResults = true;
            }
            if (item.maxTicket !== null && item.maxTicket > this.maxTicket) {
              this.maxTicket = item.maxTicket;
            }
            if (item.efectivo !== null) {
              this.totalEfectivo += item.efectivo;
            }
            if (item.totalDia !== null) {
              this.totalTotal += item.totalDia;
            }
            if (item.suma !== null) {
              this.totalSuma = item.suma;
            }
          }
          if (!hasResults) {
            this.minTicket = null;
            this.maxTicket = null;
          }
          this.loaded = true;
          console.log(this.informeDisplayedColumns);
        });
    });
  }

  checkOtros(): void {
    for (let item of this.list) {
      for (let otro of item.otros) {
        if (!this.otrosList.includes(otro.nombre)) {
          this.otrosList.push(otro.nombre);
        }
      }
    }
    this.otrosList.sort();
  }

  getTotalOtros(key: string): number {
    let total: number = 0;
    for (let item of this.list) {
      if (item.getOtrosValue(key) !== null) {
        total += item.getOtrosValue(key);
      }
    }
    return total;
  }
}
