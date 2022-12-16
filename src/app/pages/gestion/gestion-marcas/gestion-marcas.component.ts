import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatTabGroup } from "@angular/material/tabs";
import { Router } from "@angular/router";
import { MarcaInterface } from "src/app/interfaces/marca.interface";
import { Marca } from "src/app/model/marca.model";
import { DialogService } from "src/app/services/dialog.service";
import { GestionService } from "src/app/services/gestion.service";
import { MarcasService } from "src/app/services/marcas.service";
import { rolList } from "src/app/shared/rol.class";

@Component({
  selector: "otpv-gestion-marcas",
  templateUrl: "./gestion-marcas.component.html",
  styleUrls: ["./gestion-marcas.component.scss"],
})
export class GestionMarcasComponent implements OnInit {
  search: string = "";
  @ViewChild("searchBox", { static: true }) searchBox: ElementRef;
  start: boolean = true;
  canNewBrands: boolean = false;
  canDeleteBrands: boolean = false;
  canModifyBrands: boolean = false;
  canSaveChanges: boolean = false;
  canSeeStatistics: boolean = false;
  @ViewChild("marcaTabs", { static: false })
  marcaTabs: MatTabGroup;
  selectedMarca: Marca = new Marca();

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

  constructor(
    public ms: MarcasService,
    private gs: GestionService,
    private router: Router,
    private dialog: DialogService
  ) {}

  ngOnInit(): void {
    if (!this.gs.empleado) {
      this.router.navigate(["/gestion"]);
      return;
    }
    this.canNewBrands = this.gs.empleado.hasRol(
      rolList.marca.roles["crear"].id
    );
    this.canDeleteBrands = this.gs.empleado.hasRol(
      rolList.marca.roles["borrar"].id
    );
    this.canModifyBrands = this.gs.empleado.hasRol(
      rolList.marca.roles["modificar"].id
    );
    this.canSeeStatistics = this.gs.empleado.hasRol(
      rolList.marca.roles["estadisticas"].id
    );
    setTimeout(() => {
      this.searchBox.nativeElement.focus();
    }, 0);
  }

  selectMarca(marca: Marca): void {
    this.start = false;
    this.selectedMarca = marca;
    this.form.patchValue(this.selectedMarca.toInterface(false));
    this.originalValue = this.form.getRawValue();
    this.logo = marca.foto || "/assets/default.jpg";
    this.marcaTabs.realignInkBar();
    this.updateEnabledDisabled("edit");
  }

  newMarca(): void {
    this.start = false;
    this.selectedMarca = new Marca();
    this.form.patchValue(this.selectedMarca.toInterface(false));
    this.originalValue = this.form.getRawValue();
    this.logo = "/assets/default.jpg";
    this.marcaTabs.realignInkBar();
    this.updateEnabledDisabled("new");
  }

  updateEnabledDisabled(operation: string): void {
    this.form.get("nombre")?.enable();
    this.form.get("direccion")?.enable();
    this.form.get("telefono")?.enable();
    this.form.get("email")?.enable();
    this.form.get("web")?.enable();
    this.form.get("observaciones")?.enable();
    this.canSaveChanges = true;
    if (
      (operation === "new" && !this.canNewBrands) ||
      (operation === "edit" && !this.canModifyBrands)
    ) {
      this.form.get("nombre")?.disable();
      this.form.get("direccion")?.disable();
      this.form.get("telefono")?.disable();
      this.form.get("email")?.disable();
      this.form.get("web")?.disable();
      this.form.get("observaciones")?.disable();
      this.canSaveChanges = false;
    }
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
