import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
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
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { Router } from "@angular/router";
import { IdSaveResult, StatusResult } from "@interfaces/interfaces";
import {
  TipoPagoInterface,
  TiposPagoOrderInterface,
  TiposPagoResult,
} from "@interfaces/tipo-pago.interface";
import { TipoPago } from "@model/tpv/tipo-pago.model";
import { ApiService } from "@services/api.service";
import { ClassMapperService } from "@services/class-mapper.service";
import { ConfigService } from "@services/config.service";
import { DialogService } from "@services/dialog.service";
import { GestionService } from "@services/gestion.service";
import { HeaderComponent } from "@shared/components/header/header.component";
import { PayTypeListFilterPipe } from "@shared/pipes/pay-type-list-filter.pipe";

@Component({
  standalone: true,
  selector: "otpv-gestion-tipos-pago",
  templateUrl: "./gestion-tipos-pago.component.html",
  styleUrls: ["./gestion-tipos-pago.component.scss"],
  imports: [
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    PayTypeListFilterPipe,
    MatCard,
    MatCardContent,
    MatFormField,
    MatInput,
    MatIcon,
    MatActionList,
    MatListItem,
    MatButton,
    MatTabGroup,
    MatTab,
    MatCheckbox,
  ],
})
export default class GestionTiposPagoComponent implements OnInit {
  search: string = "";
  @ViewChild("searchBox", { static: true }) searchBox: ElementRef;
  start: boolean = true;
  selectedTipoPago: TipoPago = new TipoPago();
  @ViewChild("tiposPagoTabs", { static: false })
  tiposPagoTabs: MatTabGroup;

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl(null, Validators.required),
    afectaCaja: new FormControl(false),
    fisico: new FormControl(false),
  });
  originalValue: TipoPagoInterface = null;

  logo: string = "/assets/default.jpg";

  constructor(
    public config: ConfigService,
    private dialog: DialogService,
    private as: ApiService,
    private cms: ClassMapperService,
    private gs: GestionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.gs.empleado) {
      this.router.navigate(["/gestion"]);
      return;
    }
    setTimeout((): void => {
      this.searchBox.nativeElement.focus();
    }, 0);
  }

  onDrop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.config.tiposPago,
      event.previousIndex,
      event.currentIndex
    );
    const orderList: TiposPagoOrderInterface[] = [];
    for (const ind in this.config.tiposPago) {
      const i: number = parseInt(ind);
      this.config.tiposPago[ind].orden = i;
      orderList.push({ id: this.config.tiposPago[ind].id, orden: i });
    }
    this.as
      .saveTipoPagoOrden(orderList)
      .subscribe((result: StatusResult): void => {
        if (result.status === "error") {
          this.dialog.alert({
            title: "Error",
            content:
              "Ocurrió un error al guardar el orden de los tipos de pago.",
            ok: "Continuar",
          });
        }
      });
  }

  selectTipoPago(tipoPago: TipoPago): void {
    this.start = false;
    this.selectedTipoPago = tipoPago;
    this.form.patchValue(this.selectedTipoPago.toInterface(false));
    this.originalValue = this.form.getRawValue();
    this.tiposPagoTabs.realignInkBar();
    this.logo = this.selectedTipoPago.foto;
  }

  newTipoPago(): void {
    this.start = false;
    this.selectedTipoPago = new TipoPago();
    this.form.patchValue(this.selectedTipoPago.toInterface(false));
    this.originalValue = this.form.getRawValue();
    this.tiposPagoTabs.realignInkBar();
    this.logo = "/assets/default.jpg";
  }

  resetForm(): void {
    this.form.reset();
    this.form.patchValue(this.selectedTipoPago.toInterface(false));
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
    const data: TipoPagoInterface = JSON.parse(JSON.stringify(this.form.value));
    data.foto = this.logo;

    this.selectedTipoPago.fromInterface(data, false);

    this.as.saveTipoPago(data).subscribe((result: IdSaveResult): void => {
      if (result.status === "ok") {
        this.as.loadTiposPago().subscribe((result: TiposPagoResult): void => {
          this.config.tiposPago = this.cms.getTiposPago(result.list);
        });
        this.resetForm();
        this.dialog.alert({
          title: "Datos guardados",
          content:
            'Los datos del tipo de pago "' +
            this.selectedTipoPago.nombre +
            '" han sido correctamente guardados.',
          ok: "Continuar",
        });
      } else {
        this.dialog.alert({
          title: "Error",
          content: "Ocurrió un error al guardar el tipo de pago.",
          ok: "Continuar",
        });
      }
    });
  }

  deleteTipoPago(): void {
    this.dialog
      .confirm({
        title: "Confirmar",
        content:
          '¿Estás seguro de querer borrar el tipo de pago "' +
          this.selectedTipoPago.nombre +
          '"? No se borrarán las ventas de ese tipo de pago, pero dejará de estar disponible para nuevas ventas.',
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.confirmDeleteTipoPago();
        }
      });
  }

  confirmDeleteTipoPago(): void {
    this.as
      .deleteTipoPago(this.selectedTipoPago.id)
      .subscribe((result: StatusResult): void => {
        if (result.status === "ok") {
          this.as.loadTiposPago().subscribe((result: TiposPagoResult): void => {
            this.config.tiposPago = this.cms.getTiposPago(result.list);
          });
          this.start = true;
          this.dialog.alert({
            title: "Tipo de pago borrado",
            content:
              'El tipo de pago "' +
              this.selectedTipoPago.nombre +
              '" ha sido correctamente borrado.',
            ok: "Continuar",
          });
        } else {
          this.dialog.alert({
            title: "Error",
            content: "Ocurrió un error al borrar el tipo de pago.",
            ok: "Continuar",
          });
        }
      });
  }
}
