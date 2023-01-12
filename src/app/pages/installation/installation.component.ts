import { Component, OnInit } from "@angular/core";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { Router } from "@angular/router";
import {
  AppDataInterface,
  IvaOptionInterface,
  IvaReOptionInterface,
  MarginOptionInterface,
} from "src/app/interfaces/interfaces";
import { ApiService } from "src/app/services/api.service";
import { ConfigService } from "src/app/services/config.service";
import { DialogService } from "src/app/services/dialog.service";
import { GestionService } from "src/app/services/gestion.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "otpv-installation",
  templateUrl: "./installation.component.html",
  styleUrls: ["./installation.component.scss"],
})
export class InstallationComponent implements OnInit {
  back: boolean = false;

  paso: number = 1;
  nombre: string = "";
  cif: string = "";
  telefono: string = "";
  direccion: string = "";
  poblacion: string = "";
  email: string = "";
  showEmployee: boolean = true;
  nombreEmpleado: string = "";
  pass: string = "";
  confPass: string = "";
  logo: string = "";
  color: string = "#3f51b5";
  twitter: string = "";
  facebook: string = "";
  instagram: string = "";
  web: string = "";
  cajaInicial: number = 0;
  ticketInicial: number = 1;
  facturaInicial: number = 1;

  ivareOptions: IvaReOptionInterface[] = [
    { id: "iva", name: "IVA" },
    { id: "re", name: "IVA + Recargo de equivalencia" },
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

  selectedOption: string = "iva";
  selectedOptionInList: number = null;

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
    { value: 100, checked: false },
  ];

  hasOnline: string = "0";
  urlApi: string = "";
  hasExpiryDate: string = "0";
  hasEmpleados: string = "0";

  saving: boolean = false;

  constructor(
    private dialog: DialogService,
    private as: ApiService,
    private gs: GestionService,
    private router: Router,
    private config: ConfigService
  ) {}

  ngOnInit(): void {
    if (this.gs.empleado) {
      this.back = true;
      this.nombre = this.config.nombre;
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
      this.logo = environment.baseUrl + "/logo.jpg";
      this.showEmployee = false;

      this.selectedOption = this.config.tipoIva;
      for (let ivaOption of this.config.ivaOptions) {
        let ivaInd: number = this.ivaOptionsList.findIndex(
          (x: IvaOptionInterface): boolean => x.option === ivaOption.iva
        );
        this.ivaOptionsList[ivaInd].selected = true;
      }
      for (let i in this.ivaOptionsList) {
        if (this.ivaOptionsList[i].selected) {
          this.optionsList.push(parseInt(i));
        }
      }
      for (let marginOption of this.config.marginList) {
        let marginInd: number = this.marginList.findIndex(
          (x: MarginOptionInterface): boolean => x.value === marginOption
        );
        this.marginList[marginInd].checked = true;
      }

      this.hasOnline = this.config.ventaOnline ? "1" : "0";
      this.urlApi = this.config.urlApi;
      this.hasExpiryDate = this.config.fechaCad ? "1" : "0";
      this.hasEmpleados = this.config.empleados ? "1" : "0";
    }
  }

  addLogo(): void {
    document.getElementById("logo-file").click();
  }

  onLogoChange(ev: Event): void {
    const reader: FileReader = new FileReader();
    if (
      (<HTMLInputElement>ev.target).files &&
      (<HTMLInputElement>ev.target).files.length > 0
    ) {
      const file = (<HTMLInputElement>ev.target).files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.logo = reader.result as string;
        (<HTMLInputElement>document.getElementById("logo-file")).value = "";
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
      const ind: number = this.optionsList.findIndex((x) => x === i);
      this.optionsList.splice(ind, 1);
    }
    this.optionsList.sort((a, b) => a - b);
  }

  selectAllIvas(): void {
    for (let i in this.ivaOptionsList) {
      this.ivaOptionsList[i].selected = true;
      this.optionsList.push(parseInt(i));
    }
  }

  selectNoneIvas(): void {
    this.optionsList = [];
    for (let i in this.ivaOptionsList) {
      this.ivaOptionsList[i].selected = false;
    }
  }

  selectAllMargins(): void {
    for (let i in this.marginList) {
      this.marginList[i].checked = true;
    }
  }

  selectNoneMargins(): void {
    for (let i in this.marginList) {
      this.marginList[i].checked = false;
    }
  }

  saveConfiguration(): void {
    if (this.nombre === "") {
      this.dialog.alert({
        title: "Error",
        content: "¡No puedes dejar el nombre del negocio en blanco!",
        ok: "Continuar",
      });
      this.paso = 1;
      return;
    }
    if (this.cif === "") {
      this.dialog.alert({
        title: "Error",
        content: "¡No puedes dejar el CIF del negocio en blanco!",
        ok: "Continuar",
      });
      this.paso = 1;
      return;
    }
    if (this.logo === "") {
      this.dialog.alert({
        title: "Error",
        content: "¡No has añadido ningún logo!",
        ok: "Continuar",
      });
      this.paso = 1;
      return;
    }
    if (!this.gs.empleado) {
      if (this.nombreEmpleado === "") {
        this.dialog.alert({
          title: "Error",
          content:
            "¡No puedes dejar el nombre del empleado por defecto en blanco!",
          ok: "Continuar",
        });
        this.paso = 1;
        return;
      }
      if (this.pass === "") {
        this.dialog.alert({
          title: "Error",
          content: "¡No puedes dejar la contraseña en blanco!",
          ok: "Continuar",
        });
        this.paso = 1;
        return;
      }
      if (this.confPass === "") {
        this.dialog.alert({
          title: "Error",
          content:
            "¡No puedes dejar la confirmación de la contraseña en blanco!",
          ok: "Continuar",
        });
        this.paso = 1;
        return;
      }
      if (this.pass !== this.confPass) {
        this.dialog.alert({
          title: "Error",
          content: "¡Las contraseñas introducidas no coinciden!",
          ok: "Continuar",
        });
        this.paso = 1;
        return;
      }
      if (this.color === "") {
        this.dialog.alert({
          title: "Error",
          content: "¡No puedes dejar el color en blanco!",
          ok: "Continuar",
        });
        this.paso = 1;
        return;
      }
    }
    if (this.optionsList.length == 0) {
      this.dialog.alert({
        title: "Error",
        content:
          "¡No has elegido ningún valor en la lista de IVA/Recargo de equivalencias!",
        ok: "Continuar",
      });
      this.paso = 2;
      return;
    }
    for (let option of this.optionsList) {
      this.selectedIvaList.push(this.ivaOptionsList[option].option);
      if (this.selectedOption === "re") {
        this.selectedReList.push(this.reOptionsList[option]);
      }
    }

    const selectedMargins: number[] = this.marginList
      .filter((x: MarginOptionInterface): boolean => x.checked)
      .map((v: MarginOptionInterface): number => v.value);
    if (selectedMargins.length == 0) {
      this.dialog.alert({
        title: "Error",
        content:
          "¡No has elegido ningún valor en la lista de margenes de beneficio!",
        ok: "Continuar",
      });
      this.paso = 2;
      return;
    }

    if (this.hasOnline === "1" && this.urlApi === "") {
      this.dialog.alert({
        title: "Error",
        content:
          "Si has indicado que la aplicación se va a conectar con una tienda online no puedes dejar en blanco el campo URL de la API.",
        ok: "Continuar",
      });
      this.paso = 3;
      return;
    }

    const data: AppDataInterface = {
      nombre: this.nombre,
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
      ventaOnline: this.hasOnline == "1",
      urlApi: this.urlApi,
      fechaCad: this.hasExpiryDate == "1",
      empleados: this.hasEmpleados == "1",
    };

    this.saving = true;
    this.as.saveInstallation(data).subscribe((result) => {
      if (result.status === "ok") {
        this.dialog
          .alert({
            title: "Información",
            content:
              "Los datos han sido guardados, puedes continuar con la aplicación. ",
            ok: "Continuar",
          })
          .subscribe((result) => {
            this.config.status = "new";
            this.config.start().then(() => {
              if (!this.gs.empleado) {
                this.router.navigate(["/"]);
              } else {
                this.router.navigate(["/gestion"]);
              }
            });
          });
      } else {
        this.saving = false;
        this.dialog.alert({
          title: "Error",
          content: "¡Ocurrió un error al guardar los datos!",
          ok: "Continuar",
        });
        return false;
      }
    });
  }
}
