import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { Month } from '@interfaces/interfaces';
import ConfigService from '@services/config.service';

@Component({
  selector: 'otpv-generar-informe',
  imports: [MatFormField, MatSelect, MatOption, MatButton, FormsModule],
  templateUrl: './generar-informe.component.html',
  styleUrl: './generar-informe.component.scss',
})
export default class GenerarInformeComponent implements OnInit {
  private readonly config: ConfigService = inject(ConfigService);

  informeTipo: string | null = null;
  monthList: Month[] = [];
  informeMonth: number | null = null;
  yearList: number[] = [];
  informeYear: number | null = null;

  ngOnInit(): void {
    this.monthList = this.config.monthList;
    const currentYear: number = new Date().getFullYear();
    this.yearList = Array.from({ length: 5 }, (_, i) => currentYear - i);
  }

  generarInforme(): void {
    window.open(`/caja/informes/${this.informeTipo}/${this.informeYear}/${this.informeMonth}`);
  }
}
