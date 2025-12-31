import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent } from '@angular/material/card';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbar } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { environment } from '@env/environment';
import {
  AppDataInterface,
  IvaOptionInterface,
  IvaReOptionInterface,
  MarginOptionInterface,
  StatusResult,
} from '@interfaces/interfaces';
import { DialogService } from '@osumi/angular-tools';
import ApiService from '@services/api.service';
import ConfigService from '@services/config.service';
import GestionService from '@services/gestion.service';

@Component({
  selector: 'otpv-installation',
  templateUrl: './installation.component.html',
  styleUrls: ['./installation.component.scss'],
  imports: [
    FormsModule,
    RouterModule,
    MatToolbar,
    MatButton,
    MatIcon,
    MatCard,
    MatCardContent,
    MatCardActions,
    MatFormFieldModule,
    MatLabel,
    MatInput,
    MatRadioModule,
    MatCheckbox,
  ],
})
export default class InstallationComponent implements OnInit {
  private dialog: DialogService = inject(DialogService);
  private as: ApiService = inject(ApiService);
  private gs: GestionService = inject(GestionService);
  private router: Router = inject(Router);
  private config: ConfigService = inject(ConfigService);

  back: boolean = false;

  paso: number = 1;
  nombre: string = '';
  nombreComercial: string = '';
  cif: string = '';
  telefono: string = '';
  direccion: string = '';
  poblacion: string = '';
  email: string = '';
  showEmployee: boolean = true;
  nombreEmpleado: string = '';
  pass: string = '';
  confPass: string = '';
  logo: string = '';
  color: string = '#3f51b5';
  twitter: string = '';
  facebook: string = '';
  instagram: string = '';
  web: string = '';
  cajaInicial: number = 0;
  ticketInicial: number = 1;
  facturaInicial: number = 1;

  ivareOptions: IvaReOptionInterface[] = [
    { id: 'iva', name: 'IVA' },
    { id: 're', name: 'IVA + Recargo de equivalencia' },
  ];
  ivaOptionsList: IvaOptionInterface[] = [
    { option: 4, selected: false },
    { option: 10, selected: false },
    { option: 21, selected: false },
  ];
  reOptionsList: number[] = [0.5, 1.4, 5.2];

  optionsList: number[] = [];
  selectedIvaList: number[] = [];
  selectedReList: number[] = [];

  selectedOption: string = 'iva';
  selectedOptionInList: number | null = null;

  marginList: MarginOptionInterface[] = [
    { value: 10, checked: false },
    { value: 15, checked: false },
    { value: 20, checked: false },
    { value: 25, checked: false },
    { value: 30, checked: false },
    { value: 35, checked: false },
    { value: 40, checked: false },
    { value: 45, checked: false },
    { value: 50, checked: false },
    { value: 55, checked: false },
    { value: 60, checked: false },
    { value: 65, checked: false },
    { value: 70, checked: false },
    { value: 75, checked: false },
    { value: 80, checked: false },
    { value: 85, checked: false },
    { value: 90, checked: false },
    { value: 95, checked: false },
  ];

  hasOnline: string = '0';
  urlApi: string = '';
  secretApi: string = '';
  backupApiKey: string = '';
  hasExpiryDate: string = '0';
  hasEmpleados: string = '0';

  saving: boolean = false;

  ngOnInit(): void {
    if (this.gs.empleado) {
      this.back = true;
      this.nombre = this.config.nombre;
      this.nombreComercial = this.config.nombreComercial;
      this.cif = this.config.cif;
      this.telefono = this.config.telefono;
      this.email = this.config.email;
      this.direccion = this.config.direccion;
      this.poblacion = this.config.poblacion;
      this.twitter = this.config.twitter;
      this.facebook = this.config.facebook;
      this.instagram = this.config.instagram;
      this.web = this.config.web;
      this.cajaInicial = this.config.cajaInicial;
      this.ticketInicial = this.config.ticketInicial;
      this.facturaInicial = this.config.facturaInicial;
      this.logo = environment.baseUrl + '/logo.jpg';
      this.showEmployee = false;

      this.selectedOption = this.config.tipoIva;
      for (const ivaOption of this.config.ivaOptions) {
        const ivaInd: number = this.ivaOptionsList.findIndex(
          (x: IvaOptionInterface): boolean => x.option === ivaOption.iva
        );
        this.ivaOptionsList[ivaInd].selected = true;
      }
      for (const i in this.ivaOptionsList) {
        if (this.ivaOptionsList[i].selected) {
          this.optionsList.push(parseInt(i));
        }
      }
      for (const marginOption of this.config.marginList) {
        const marginInd: number = this.marginList.findIndex(
          (x: MarginOptionInterface): boolean => x.value === marginOption
        );
        this.marginList[marginInd].checked = true;
      }

      this.hasOnline = this.config.ventaOnline ? '1' : '0';
      this.urlApi = this.config.urlApi;
      this.secretApi = this.config.secretApi;
      this.backupApiKey = this.config.backupApiKey;
      this.hasExpiryDate = this.config.fechaCad ? '1' : '0';
      this.hasEmpleados = this.config.empleados ? '1' : '0';
    }
  }

  addLogo(): void {
    const obj: HTMLElement | null = document.getElementById('logo-file');
    if (obj !== null) {
      obj.click();
    }
  }

  onLogoChange(ev: Event): void {
    const reader: FileReader = new FileReader();
    const files: FileList | null = (ev.target as HTMLInputElement).files;
    if (files !== null && files.length > 0) {
      const file = files[0];
      reader.readAsDataURL(file);
      reader.onload = (): void => {
        this.logo = reader.result as string;
        (document.getElementById('logo-file') as HTMLInputElement).value = '';
      };
    }
  }

  irAPaso(paso: number): void {
    this.paso = paso;
  }

  checkIva(ev: MatCheckboxChange, i: number): void {
    if (ev.checked) {
      this.optionsList.push(i);
    } else {
      const ind: number = this.optionsList.findIndex((x: number): boolean => x === i);
      this.optionsList.splice(ind, 1);
    }
    this.optionsList.sort((a, b) => a - b);
  }

  selectAllIvas(): void {
    for (const i in this.ivaOptionsList) {
      this.ivaOptionsList[i].selected = true;
      this.optionsList.push(parseInt(i));
    }
  }

  selectNoneIvas(): void {
    this.optionsList = [];
    for (const i in this.ivaOptionsList) {
      this.ivaOptionsList[i].selected = false;
    }
  }

  selectAllMargins(): void {
    for (const i in this.marginList) {
      this.marginList[i].checked = true;
    }
  }

  selectNoneMargins(): void {
    for (const i in this.marginList) {
      this.marginList[i].checked = false;
    }
  }

  saveConfiguration(): void {
    if (this.nombre === '') {
      this.dialog.alert({
        title: 'Error',
        content: '¡No puedes dejar el nombre del negocio en blanco!',
      });
      this.paso = 1;
      return;
    }
    if (this.nombreComercial === '') {
      this.dialog.alert({
        title: 'Error',
        content: '¡No puedes dejar el nombre comercial en blanco!',
      });
      this.paso = 1;
      return;
    }
    if (this.cif === '') {
      this.dialog.alert({
        title: 'Error',
        content: '¡No puedes dejar el CIF del negocio en blanco!',
      });
      this.paso = 1;
      return;
    }
    if (this.logo === '') {
      this.dialog.alert({
        title: 'Error',
        content: '¡No has añadido ningún logo!',
      });
      this.paso = 1;
      return;
    }
    if (!this.gs.empleado) {
      if (this.nombreEmpleado === '') {
        this.dialog.alert({
          title: 'Error',
          content: '¡No puedes dejar el nombre del empleado por defecto en blanco!',
        });
        this.paso = 1;
        return;
      }
      if (this.pass === '') {
        this.dialog.alert({
          title: 'Error',
          content: '¡No puedes dejar la contraseña en blanco!',
        });
        this.paso = 1;
        return;
      }
      if (this.confPass === '') {
        this.dialog.alert({
          title: 'Error',
          content: '¡No puedes dejar la confirmación de la contraseña en blanco!',
        });
        this.paso = 1;
        return;
      }
      if (this.pass !== this.confPass) {
        this.dialog.alert({
          title: 'Error',
          content: '¡Las contraseñas introducidas no coinciden!',
        });
        this.paso = 1;
        return;
      }
      if (this.color === '') {
        this.dialog.alert({
          title: 'Error',
          content: '¡No puedes dejar el color en blanco!',
        });
        this.paso = 1;
        return;
      }
    }
    if (this.optionsList.length == 0) {
      this.dialog.alert({
        title: 'Error',
        content: '¡No has elegido ningún valor en la lista de IVA/Recargo de equivalencias!',
      });
      this.paso = 2;
      return;
    }
    for (const option of this.optionsList) {
      this.selectedIvaList.push(this.ivaOptionsList[option].option);
      if (this.selectedOption === 're') {
        this.selectedReList.push(this.reOptionsList[option]);
      }
    }

    const selectedMargins: number[] = this.marginList
      .filter((x: MarginOptionInterface): boolean => x.checked)
      .map((v: MarginOptionInterface): number => v.value);
    if (selectedMargins.length == 0) {
      this.dialog.alert({
        title: 'Error',
        content: '¡No has elegido ningún valor en la lista de margenes de beneficio!',
      });
      this.paso = 2;
      return;
    }

    if (this.hasOnline === '1' && this.urlApi === '') {
      this.dialog.alert({
        title: 'Error',
        content:
          'Si has indicado que la aplicación se va a conectar con una tienda online no puedes dejar en blanco el campo URL de la API.',
      });
      this.paso = 3;
      return;
    }

    const data: AppDataInterface = {
      nombre: this.nombre,
      nombreComercial: this.nombreComercial,
      cif: this.cif,
      telefono: this.telefono,
      direccion: this.direccion,
      poblacion: this.poblacion,
      email: this.email,
      logo: this.logo,
      nombreEmpleado: this.nombreEmpleado,
      pass: this.pass,
      color: this.color,
      twitter: this.twitter,
      facebook: this.facebook,
      instagram: this.instagram,
      web: this.web,
      cajaInicial: this.cajaInicial,
      ticketInicial: this.ticketInicial,
      facturaInicial: this.facturaInicial,
      tipoIva: this.selectedOption,
      ivaList: this.selectedIvaList,
      reList: this.selectedReList,
      marginList: selectedMargins,
      ventaOnline: this.hasOnline == '1',
      urlApi: this.urlApi,
      secretApi: this.secretApi,
      backupApiKey: this.backupApiKey,
      fechaCad: this.hasExpiryDate == '1',
      empleados: this.hasEmpleados == '1',
    };

    this.saving = true;
    this.as.saveInstallation(data).subscribe((result: StatusResult): void => {
      if (result.status === 'ok') {
        this.dialog
          .alert({
            title: 'Información',
            content: 'Los datos han sido guardados, puedes continuar con la aplicación. ',
          })
          .subscribe((): void => {
            this.config.status = 'new';
            this.config.start().then((): void => {
              if (!this.gs.empleado) {
                this.router.navigate(['/']);
              } else {
                this.router.navigate(['/gestion']);
              }
            });
          });
      } else {
        this.saving = false;
        this.dialog.alert({
          title: 'Error',
          content: '¡Ocurrió un error al guardar los datos!',
        });
      }
    });
  }
}
