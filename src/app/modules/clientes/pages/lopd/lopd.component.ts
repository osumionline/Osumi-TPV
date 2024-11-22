import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ClienteResult } from '@interfaces/cliente.interface';
import Cliente from '@model/clientes/cliente.model';
import ClassMapperService from '@services/class-mapper.service';
import ClientesService from '@services/clientes.service';
import ConfigService from '@services/config.service';

@Component({
  selector: 'otpv-lopd',
  templateUrl: './lopd.component.html',
  styleUrls: ['./lopd.component.scss'],
})
export default class LopdComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private config: ConfigService = inject(ConfigService);
  private cs: ClientesService = inject(ClientesService);
  private cms: ClassMapperService = inject(ClassMapperService);

  nombre: string = '';
  poblacion: string = '';
  day: number = null;
  month: string = null;
  year: number = null;
  cliente: Cliente = null;

  constructor() {
    document.body.classList.add('white-bg');
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.cs.getCliente(params.id).subscribe((result: ClienteResult): void => {
        this.nombre = this.config.nombre;
        this.poblacion = this.config.poblacion;

        const d: Date = new Date();
        this.day = d.getDate();
        this.month = this.config.monthList[d.getMonth()].name;
        this.year = d.getFullYear();

        this.cliente = this.cms.getCliente(result.cliente);

        setTimeout((): void => {
          window.print();
        });
      });
    });
  }
}
