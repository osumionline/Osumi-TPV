import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MarcaInterface } from "src/app/interfaces/interfaces";
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
  selectedMarca: Marca = new Marca();

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl(null, Validators.required),
    logo: new FormControl(false),
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
  }

  selectMarca(marca: Marca): void {
    this.start = false;
    this.selectedMarca = marca;
    this.form.patchValue(this.selectedMarca.toInterface(false));
    this.originalValue = this.form.getRawValue();
  }

  newMarca(): void {
    this.start = false;
    this.selectedMarca = new Marca();
    this.form.patchValue(this.selectedMarca.toInterface(false));
    this.originalValue = this.form.getRawValue();
  }

  resetForm(): void {
    this.form.reset();
    this.form.patchValue(this.selectedMarca.toInterface(false));
  }

  onSubmit(): void {}

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
