import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatTabGroup } from "@angular/material/tabs";
import { MarcaInterface } from "src/app/interfaces/marca.interface";
import { Marca } from "src/app/model/marcas/marca.model";
import { DialogService } from "src/app/services/dialog.service";
import { MarcasService } from "src/app/services/marcas.service";

@Component({
  selector: "otpv-marcas",
  templateUrl: "./marcas.component.html",
  styleUrls: ["./marcas.component.scss"],
})
export class MarcasComponent {
  search: string = "";
  @ViewChild("searchBox", { static: true }) searchBox: ElementRef;
  start: boolean = true;
  @ViewChild("marcaTabs", { static: false })
  marcaTabs: MatTabGroup;
  selectedMarca: Marca = new Marca();

  @ViewChild("nameBox", { static: true }) nameBox: ElementRef;
  logo: string = "/assets/default.jpg";

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl(null, Validators.required),
    direccion: new FormControl(null),
    telefono: new FormControl(null),
    email: new FormControl(null),
    web: new FormControl(null),
    observaciones: new FormControl(null),
  });
  originalValue: MarcaInterface = null;

  constructor(public ms: MarcasService, private dialog: DialogService) {}

  searchFocus(): void {
    setTimeout(() => {
      this.searchBox.nativeElement.focus();
    }, 100);
  }

  selectMarca(marca: Marca): void {
    this.start = false;
    this.selectedMarca = marca;
    this.form.patchValue(this.selectedMarca.toInterface(false));
    this.originalValue = this.form.getRawValue();
    this.logo = marca.foto || "/assets/default.jpg";
    this.marcaTabs.realignInkBar();
    setTimeout(() => {
      this.nameBox.nativeElement.focus();
    }, 0);
  }

  newMarca(): void {
    this.start = false;
    this.selectedMarca = new Marca();
    this.form.patchValue(this.selectedMarca.toInterface(false));
    this.originalValue = this.form.getRawValue();
    this.logo = "/assets/default.jpg";
    this.marcaTabs.realignInkBar();
    setTimeout(() => {
      this.nameBox.nativeElement.focus();
    }, 0);
  }

  resetForm(): void {
    this.form.reset();
    this.form.patchValue(this.selectedMarca.toInterface(false));
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

  onSubmit(): void {
    const data: MarcaInterface = JSON.parse(JSON.stringify(this.form.value));
    data.foto = this.logo;

    this.selectedMarca.fromInterface(data, false);
    this.ms.saveMarca(data).subscribe((result) => {
      this.ms.resetMarcas();
      this.resetForm();
      this.dialog
        .alert({
          title: "Datos guardados",
          content:
            'Los datos de la marca "' +
            this.selectedMarca.nombre +
            '" han sido correctamente guardados.',
          ok: "Continuar",
        })
        .subscribe((result) => {});
    });
  }

  deleteMarca(): void {
    this.dialog
      .confirm({
        title: "Confirmar",
        content:
          '¿Estás seguro de querer borrar la marca "' +
          this.selectedMarca.nombre +
          '"? No se borrarán los artículos de esa marca, pero todos los artículos de esa marca dejarán de estar disponibles para venta hasta que no se les asigne una marca nueva.',
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result) => {
        if (result === true) {
          this.confirmDeleteMarca();
        }
      });
  }

  confirmDeleteMarca(): void {
    this.ms.deleteMarca(this.selectedMarca.id).subscribe((result) => {
      this.ms.resetMarcas();
      this.start = true;
      this.dialog
        .alert({
          title: "Marca borrada",
          content:
            'La marca "' +
            this.selectedMarca.nombre +
            '" ha sido correctamente borrada.',
          ok: "Continuar",
        })
        .subscribe((result) => {});
    });
  }
}
