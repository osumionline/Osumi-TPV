import { NgClass } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { MatCard, MatCardContent } from "@angular/material/card";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatFormField } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { MatActionList, MatListItem } from "@angular/material/list";
import { MatOption, MatSelect } from "@angular/material/select";
import { MatTab, MatTabChangeEvent, MatTabGroup } from "@angular/material/tabs";
import { IdSaveResult, StatusResult } from "@interfaces/interfaces";
import { SelectMarcaInterface } from "@interfaces/marca.interface";
import {
  ComercialInterface,
  ProveedorInterface,
} from "@interfaces/proveedor.interface";
import { Comercial } from "@model/proveedores/comercial.model";
import { Proveedor } from "@model/proveedores/proveedor.model";
import { DialogService } from "@services/dialog.service";
import { MarcasService } from "@services/marcas.service";
import { ProveedoresService } from "@services/proveedores.service";
import { ProviderBrandListFilterPipe } from "@shared/pipes/provider-brand-list-filter.pipe";
import { ProviderListFilterPipe } from "@shared/pipes/provider-list-filter.pipe";

@Component({
  standalone: true,
  selector: "otpv-proveedores",
  templateUrl: "./proveedores.component.html",
  styleUrls: ["./proveedores.component.scss"],
  imports: [
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    ProviderBrandListFilterPipe,
    ProviderListFilterPipe,
    MatCard,
    MatCardContent,
    MatFormField,
    MatInput,
    MatActionList,
    MatListItem,
    MatButton,
    MatIcon,
    MatTabGroup,
    MatTab,
    MatSelect,
    MatOption,
    MatCheckbox,
  ],
})
export class ProveedoresComponent implements OnInit {
  search: string = "";
  @ViewChild("searchBox", { static: true }) searchBox: ElementRef;
  start: boolean = true;
  selectedProveedor: Proveedor = new Proveedor();
  @ViewChild("proveedorTabs", { static: false })
  proveedorTabs: MatTabGroup;
  selectedTab: number = 0;

  searchMarcas: string = "";
  @ViewChild("searchMarcasBox", { static: true }) searchMarcasBox: ElementRef;
  marcasList: SelectMarcaInterface[] = [];

  @ViewChild("nameBox", { static: true }) nameBox: ElementRef;

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

  logo: string = "/assets/default.jpg";

  selectedComercialId: number = -1;
  showComercial: boolean = false;
  formComercial: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl(null, Validators.required),
    telefono: new FormControl(null),
    email: new FormControl(null),
    observaciones: new FormControl(null),
  });
  originalComercialValue: ComercialInterface = null;
  @ViewChild("comercialNameBox", { static: true }) comercialNameBox: ElementRef;
  selectedComercial: Comercial = new Comercial();
  canSeeStatistics: boolean = false;

  constructor(
    public ps: ProveedoresService,
    private ms: MarcasService,
    private dialog: DialogService
  ) {}

  ngOnInit(): void {
    for (const marca of this.ms.marcas()) {
      this.marcasList.push({
        id: marca.id,
        nombre: marca.nombre,
        selected: false,
      });
    }
  }

  searchFocus(): void {
    setTimeout((): void => {
      this.searchBox.nativeElement.focus();
    }, 100);
  }

  selectProveedor(proveedor: Proveedor): void {
    this.start = false;
    this.selectedProveedor = proveedor;
    this.form.patchValue(this.selectedProveedor.toInterface(false));
    this.originalValue = this.form.getRawValue();
    this.proveedorTabs.realignInkBar();
    this.updateMarcasList();
    setTimeout((): void => {
      this.nameBox.nativeElement.focus();
    }, 0);
  }

  newProveedor(): void {
    this.start = false;
    this.selectedProveedor = new Proveedor();
    this.form.patchValue(this.selectedProveedor.toInterface(false));
    this.originalValue = this.form.getRawValue();
    this.proveedorTabs.realignInkBar();
    this.updateMarcasList();
    setTimeout((): void => {
      this.nameBox.nativeElement.focus();
    }, 0);
  }

  updateMarcasList(): void {
    for (const marca of this.marcasList) {
      marca.selected = false;
      if (this.selectedProveedor.marcas.includes(marca.id)) {
        marca.selected = true;
      }
    }
  }

  resetForm(): void {
    this.form.reset();
    this.form.patchValue(this.selectedProveedor.toInterface(false));
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
    const data: ProveedorInterface = JSON.parse(
      JSON.stringify(this.form.value)
    );
    data.foto = this.logo;
    this.selectedProveedor.fromInterface(data, null, false);

    const proveedorMarcasList: number[] = [];
    for (const marca of this.marcasList) {
      if (marca.selected) {
        proveedorMarcasList.push(marca.id);
      }
    }
    this.selectedProveedor.marcas = proveedorMarcasList;
    data.marcas = this.selectedProveedor.marcas;
    this.ps.saveProveedor(data).subscribe((result: IdSaveResult): void => {
      this.selectedProveedor.id = result.id;
      this.ps.resetProveedores();
      this.resetForm();
      this.dialog.alert({
        title: "Datos guardados",
        content:
          'Los datos del proveedor "' +
          this.selectedProveedor.nombre +
          '" han sido correctamente guardados.',
        ok: "Continuar",
      });
    });
  }

  deleteProveedor(): void {
    this.dialog
      .confirm({
        title: "Confirmar",
        content:
          '¿Estás seguro de querer borrar el proveedor "' +
          this.selectedProveedor.nombre +
          '"? Las marcas asociadas al proveedor no se borrarán, pero si se borrarán sus comerciales asociados.',
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.confirmDeleteProveedor();
        }
      });
  }

  confirmDeleteProveedor(): void {
    this.ps
      .deleteProveedor(this.selectedProveedor.id)
      .subscribe((result: StatusResult): void => {
        if (result.status === "ok") {
          this.ps.resetProveedores();
          this.start = true;
          this.dialog.alert({
            title: "Proveedor borrado",
            content:
              'El proveedor "' +
              this.selectedProveedor.nombre +
              '" ha sido correctamente borrado.',
            ok: "Continuar",
          });
        } else {
          this.dialog.alert({
            title: "Error",
            content: "Ocurrió un error al borrar el proveedor.",
            ok: "Continuar",
          });
        }
      });
  }

  checkMarcasTab(tab: MatTabChangeEvent): void {
    if (tab.index === 1) {
      setTimeout((): void => {
        this.searchMarcasBox.nativeElement.focus();
      }, 100);
    }
  }

  selectComercial(id: number): void {
    const comercialInd: number = this.selectedProveedor.comerciales.findIndex(
      (x: Comercial): boolean => x.id === id
    );
    this.selectedComercial = new Comercial().fromInterface(
      this.selectedProveedor.comerciales[comercialInd],
      false
    );
    this.formComercial.patchValue(this.selectedComercial.toInterface(false));
    this.originalValue = this.form.getRawValue();
    this.showComercial = true;
    setTimeout((): void => {
      this.comercialNameBox.nativeElement.focus();
    }, 0);
  }

  newComercial(): void {
    this.selectedComercial = new Comercial();
    this.formComercial.patchValue(this.selectedComercial.toInterface(false));
    this.originalComercialValue = this.formComercial.getRawValue();
    this.showComercial = true;
    setTimeout((): void => {
      this.comercialNameBox.nativeElement.focus();
    }, 0);
  }

  resetComercialForm(): void {
    this.formComercial.reset();
    this.formComercial.patchValue(this.selectedComercial.toInterface(false));
  }

  onComercialSubmit(): void {
    const data: ComercialInterface = JSON.parse(
      JSON.stringify(this.formComercial.value)
    );
    this.selectedComercial.fromInterface(data, false);
    data.idProveedor = this.selectedProveedor.id;
    this.selectedComercial.idProveedor = this.selectedProveedor.id;

    this.ps.saveComercial(data).subscribe((result: IdSaveResult): void => {
      this.selectedComercial.id = result.id;
      this.resetComercialForm();
      this.dialog
        .alert({
          title: "Datos guardados",
          content:
            'Los datos del comercial "' +
            this.selectedComercial.nombre +
            '" han sido correctamente guardados.',
          ok: "Continuar",
        })
        .subscribe((): void => {
          const comercialInd: number =
            this.selectedProveedor.comerciales.findIndex(
              (x: Comercial): boolean => x.id === this.selectedComercial.id
            );
          if (comercialInd == -1) {
            this.selectedProveedor.comerciales.push(
              new Comercial().fromInterface(
                this.selectedComercial.toInterface()
              )
            );
          } else {
            this.selectedProveedor.comerciales[comercialInd] =
              new Comercial().fromInterface(
                this.selectedComercial.toInterface()
              );
          }
        });
    });
  }

  deleteComercial(): void {
    this.dialog
      .confirm({
        title: "Confirmar",
        content:
          '¿Estás seguro de querer borrar el comercial "' +
          this.selectedComercial.nombre +
          '"?',
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.confirmDeleteComercial();
        }
      });
  }

  confirmDeleteComercial(): void {
    this.ps
      .deleteComercial(this.selectedComercial.id)
      .subscribe((result: StatusResult): void => {
        if (result.status === "ok") {
          this.dialog
            .alert({
              title: "Comercial borrado",
              content:
                'El comercial "' +
                this.selectedComercial.nombre +
                '" ha sido correctamente borrado.',
              ok: "Continuar",
            })
            .subscribe((): void => {
              const comercialInd: number =
                this.selectedProveedor.comerciales.findIndex(
                  (x: Comercial): boolean => x.id === this.selectedComercial.id
                );
              this.selectedProveedor.comerciales.splice(comercialInd, 1);
              this.showComercial = false;
            });
        } else {
          this.dialog.alert({
            title: "Error",
            content: "Ocurrió un error al borrar el comercial.",
            ok: "Continuar",
          });
        }
      });
  }
}
