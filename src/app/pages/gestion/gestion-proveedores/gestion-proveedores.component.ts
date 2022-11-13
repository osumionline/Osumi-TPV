import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatTabGroup } from "@angular/material/tabs";
import { Router } from "@angular/router";
import { ProveedorInterface } from "src/app/interfaces/interfaces";
import { Proveedor } from "src/app/model/proveedor.model";
import { GestionService } from "src/app/services/gestion.service";
import { ProveedoresService } from "src/app/services/proveedores.service";
import { rolList } from "src/app/shared/rol.class";

@Component({
  selector: "otpv-gestion-proveedores",
  templateUrl: "./gestion-proveedores.component.html",
  styleUrls: ["./gestion-proveedores.component.scss"],
})
export class GestionProveedoresComponent implements OnInit {
  search: string = "";
  @ViewChild("searchBox", { static: true }) searchBox: ElementRef;
  canNewProviders: boolean = false;
  start: boolean = true;
  selectedProveedor: Proveedor = new Proveedor();
  @ViewChild("proveedorTabs", { static: false })
  proveedorTabs: MatTabGroup;

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl(null, Validators.required),
    direccion: new FormControl(null),
    telefono: new FormControl(null),
    email: new FormControl(null),
    web: new FormControl(null),
    observaciones: new FormControl(null),
  });
  originalValue: ProveedorInterface = null;

  constructor(
    public ps: ProveedoresService,
    private router: Router,
    private gs: GestionService
  ) {}

  ngOnInit(): void {
    if (!this.gs.empleado) {
      this.router.navigate(["/gestion"]);
      return;
    }
    this.canNewProviders = this.gs.empleado.hasRol(
      rolList.proveedor.roles["crear"].id
    );
  }

  selectProveedor(proveedor: Proveedor): void {
    this.start = false;
    this.selectedProveedor = proveedor;
    this.form.patchValue(this.selectedProveedor.toInterface(false));
    this.originalValue = this.form.getRawValue();
    this.proveedorTabs.realignInkBar();
  }

  newProveedor(): void {
    this.start = false;
    this.selectedProveedor = new Proveedor();
    this.form.patchValue(this.selectedProveedor.toInterface(false));
    this.originalValue = this.form.getRawValue();
    this.proveedorTabs.realignInkBar();
  }
}
