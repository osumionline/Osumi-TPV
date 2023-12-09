import { CommonModule } from "@angular/common";
import { Component, ElementRef, ViewChild } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatTabGroup, MatTabsModule } from "@angular/material/tabs";
import { IdSaveResult, StatusResult } from "src/app/interfaces/interfaces";
import { MarcaInterface } from "src/app/interfaces/marca.interface";
import { Marca } from "src/app/model/marcas/marca.model";
import { BrandListFilterPipe } from "src/app/modules/shared/pipes/brand-list-filter.pipe";
import { DialogService } from "src/app/services/dialog.service";
import { MarcasService } from "src/app/services/marcas.service";

@Component({
  standalone: true,
  selector: "otpv-marcas",
  templateUrl: "./marcas.component.html",
  styleUrls: ["./marcas.component.scss"],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrandListFilterPipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
  ],
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
  canSeeStatistics: boolean = false;

  constructor(public ms: MarcasService, private dialog: DialogService) {}

  searchFocus(): void {
    setTimeout((): void => {
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
    setTimeout((): void => {
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
    setTimeout((): void => {
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
      reader.onload = (): void => {
        this.logo = reader.result as string;
        (<HTMLInputElement>document.getElementById("logo-file")).value = "";
      };
    }
  }

  onSubmit(): void {
    const data: MarcaInterface = JSON.parse(JSON.stringify(this.form.value));
    data.foto = this.logo;

    this.selectedMarca.fromInterface(data, false);
    this.ms.saveMarca(data).subscribe((result: IdSaveResult): void => {
      if (result.status === "ok") {
        this.ms.resetMarcas();
        this.resetForm();
        this.dialog.alert({
          title: "Datos guardados",
          content:
            'Los datos de la marca "' +
            this.selectedMarca.nombre +
            '" han sido correctamente guardados.',
          ok: "Continuar",
        });
      } else {
        this.dialog.alert({
          title: "Error",
          content: "Ocurrió un error al guardar los datos de la marca.",
          ok: "Continuar",
        });
      }
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
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.confirmDeleteMarca();
        }
      });
  }

  confirmDeleteMarca(): void {
    this.ms
      .deleteMarca(this.selectedMarca.id)
      .subscribe((result: StatusResult): void => {
        if (result.status === "ok") {
          this.ms.resetMarcas();
          this.start = true;
          this.dialog.alert({
            title: "Marca borrada",
            content:
              'La marca "' +
              this.selectedMarca.nombre +
              '" ha sido correctamente borrada.',
            ok: "Continuar",
          });
        } else {
          this.dialog.alert({
            title: "Error",
            content: "Ocurrió un error al borrar la marca.",
            ok: "Continuar",
          });
        }
      });
  }
}
