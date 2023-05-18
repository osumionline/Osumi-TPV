import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Params } from "@angular/router";
import { urldecode } from "@osumi/tools";
import { InformeMensualResult } from "src/app/interfaces/informes.interface";
import { Month } from "src/app/interfaces/interfaces";
import { InformeMensualItem } from "src/app/model/caja/informe-mensual-item.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { FixedNumberPipe } from "src/app/modules/shared/pipes/fixed-number.pipe";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ConfigService } from "src/app/services/config.service";
import { InformesService } from "src/app/services/informes.service";

@Component({
  standalone: true,
  selector: "otpv-informe-simple",
  templateUrl: "./informe-simple.component.html",
  styleUrls: ["./informe-simple.component.scss"],
  imports: [CommonModule, MaterialModule, FixedNumberPipe],
})
export default class InformeSimpleComponent implements OnInit {
  loaded: boolean = false;
  year: number = null;
  monthName: string = null;
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
  otrosNames = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private is: InformesService,
    private cms: ClassMapperService,
    private config: ConfigService
  ) {
    document.body.classList.add("white-bg");
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.month = parseInt(params.month);
      this.year = parseInt(params.year);
      const indMonth: number = this.config.monthList.findIndex(
        (x: Month): boolean => {
          return x.id === this.month;
        }
      );
      this.monthName = this.config.monthList[indMonth].name;

      this.is
        .getInformeSimple(this.month, this.year)
        .subscribe((result: InformeMensualResult): void => {
          this.list = this.cms.getInformeMensualItems(result.list);
          this.checkOtros();
          for (let otro of this.otrosList) {
            this.informeDisplayedColumns.push(otro);
            this.otrosNames[otro] = urldecode(otro);
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
