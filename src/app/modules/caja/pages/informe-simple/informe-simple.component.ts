import {
  Component,
  inject,
  input,
  InputSignalWithTransform,
  numberAttribute,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { InformeMensualResult } from '@interfaces/informes.interface';
import { Month } from '@interfaces/interfaces';
import InformeMensualItem from '@model/caja/informe-mensual-item.model';
import { urldecode } from '@osumi/tools';
import ClassMapperService from '@services/class-mapper.service';
import ConfigService from '@services/config.service';
import InformesService from '@services/informes.service';
import FixedNumberPipe from '@shared/pipes/fixed-number.pipe';

@Component({
  selector: 'otpv-informe-simple',
  templateUrl: './informe-simple.component.html',
  styleUrls: ['./informe-simple.component.scss'],
  imports: [FixedNumberPipe, MatTableModule],
})
export default class InformeSimpleComponent implements OnInit {
  private is: InformesService = inject(InformesService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private config: ConfigService = inject(ConfigService);

  loaded: WritableSignal<boolean> = signal<boolean>(false);
  year: InputSignalWithTransform<number, unknown> = input.required({
    transform: numberAttribute,
  });
  month: InputSignalWithTransform<number, unknown> = input.required({
    transform: numberAttribute,
  });
  monthName: WritableSignal<string> = signal<string>('');
  list: InformeMensualItem[] = [];
  otrosList: string[] = [];
  minTicket: number | null = 999999999;
  maxTicket: number | null = 0;
  totalEfectivo: number = 0;

  totalTotal: WritableSignal<number> = signal<number>(0);
  totalSuma: WritableSignal<number> = signal<number>(0);

  informeDisplayedColumns: string[] = ['fecha', 'tickets', 'efectivo'];
  informeDataSource: MatTableDataSource<InformeMensualItem> =
    new MatTableDataSource<InformeMensualItem>();
  otrosNames: Record<string, string> = {};

  constructor() {
    document.body.classList.add('white-bg');
  }

  ngOnInit(): void {
    const indMonth: number = this.config.monthList.findIndex((x: Month): boolean => {
      return x.id === this.month();
    });
    this.monthName.set(this.config.monthList[indMonth].name);

    this.is
      .getInformeSimple(this.month(), this.year())
      .subscribe((result: InformeMensualResult): void => {
        this.list = this.cms.getInformeMensualItems(result.list);
        this.checkOtros();
        for (const otro of this.otrosList) {
          this.informeDisplayedColumns.push(otro);
          this.otrosNames[otro] = urldecode(otro);
        }
        this.informeDisplayedColumns.push('totalDia');
        this.informeDisplayedColumns.push('suma');
        this.informeDataSource.data = this.list;
        let hasResults: boolean = false;
        for (const item of this.list) {
          if (item.minTicket !== null && item.minTicket < (this.minTicket ?? 0)) {
            this.minTicket = item.minTicket;
            hasResults = true;
          }
          if (item.maxTicket !== null && item.maxTicket > (this.maxTicket ?? 0)) {
            this.maxTicket = item.maxTicket;
          }
          if (item.efectivo !== null) {
            this.totalEfectivo += item.efectivo;
          }
          if (item.totalDia !== null) {
            this.totalTotal.update((value: number): number => (value += item.totalDia ?? 0));
          }
          if (item.suma !== null) {
            this.totalSuma.set(item.suma);
          }
        }
        if (!hasResults) {
          this.minTicket = null;
          this.maxTicket = null;
        }
        this.loaded.set(true);
      });
  }

  checkOtros(): void {
    for (const item of this.list) {
      for (const otro of item.otros) {
        if (!this.otrosList.includes(otro.nombre)) {
          this.otrosList.push(otro.nombre);
        }
      }
    }
    this.otrosList.sort();
  }

  getTotalOtros(key: string): number {
    let total: number = 0;
    for (const item of this.list) {
      if (item.getOtrosValue(key) !== null) {
        total += item.getOtrosValue(key) ?? 0;
      }
    }
    return total;
  }
}
