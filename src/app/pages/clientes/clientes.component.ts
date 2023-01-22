import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatTabGroup } from "@angular/material/tabs";
import { ActivatedRoute, Params } from "@angular/router";
import { EditFacturaModalComponent } from "src/app/components/modals/edit-factura-modal/edit-factura-modal.component";
import { ChartSelectInterface } from "src/app/interfaces/articulo.interface";
import { Month } from "src/app/interfaces/interfaces";
import { FacturaModal } from "src/app/interfaces/modals.interface";
import { Cliente } from "src/app/model/cliente.model";
import { Factura } from "src/app/model/factura.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ClientesService } from "src/app/services/clientes.service";
import { ConfigService } from "src/app/services/config.service";
import { DialogService } from "src/app/services/dialog.service";
import { OverlayService } from "./../../services/overlay.service";

@Component({
  selector: "otpv-clientes",
  templateUrl: "./clientes.component.html",
  styleUrls: ["./clientes.component.scss"],
})
export class ClientesComponent implements OnInit {
  search: string = "";
  @ViewChild("searchBox", { static: true }) searchBox: ElementRef;
  start: boolean = true;
  @ViewChild("clienteTabs", { static: true })
  clienteTabs: MatTabGroup;
  selectedIndex: number = 0;
  selectedClient: Cliente = new Cliente();
  @ViewChild("nameBox", { static: true }) nameBox: ElementRef;
  @ViewChild("emailBox", { static: true }) emailBox: ElementRef;
  focusEmail: boolean = false;

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombreApellidos: new FormControl(null, Validators.required),
    dniCif: new FormControl(null),
    telefono: new FormControl(null),
    email: new FormControl(null),
    direccion: new FormControl(null),
    codigoPostal: new FormControl(null),
    poblacion: new FormControl(null),
    provincia: new FormControl(null),
    factIgual: new FormControl(true),
    factNombreApellidos: new FormControl(null),
    factDniCif: new FormControl(null),
    factTelefono: new FormControl(null),
    factEmail: new FormControl(null),
    factDireccion: new FormControl(null),
    factCodigoPostal: new FormControl(null),
    factPoblacion: new FormControl(null),
    factProvincia: new FormControl(null),
    observaciones: new FormControl(null),
  });

  facturasDisplayedColumns: string[] = ["id", "fecha", "importe", "opciones"];
  facturasDataSource: MatTableDataSource<Factura> =
    new MatTableDataSource<Factura>();

  @ViewChild("editFactura", { static: true })
  editFactura: EditFacturaModalComponent;

  stats: ChartSelectInterface = {
    data: "consumo",
    type: "units",
    month: -1,
    year: -1,
  };
  monthList: Month[] = [];
  yearList: number[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    public cs: ClientesService,
    public config: ConfigService,
    private dialog: DialogService,
    private cms: ClassMapperService,
    private overlayService: OverlayService
  ) {}

  ngOnInit(): void {
    this.monthList = this.config.monthList;
    const d = new Date();
    for (let y: number = d.getFullYear() - 5; y <= d.getFullYear(); y++) {
      this.yearList.push(y);
    }
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.new) {
        if (params.new === "new") {
          this.newCliente();
        } else {
          const ind: number = this.cs.clientes.findIndex(
            (x: Cliente): boolean => {
              return x.id === parseInt(params.new);
            }
          );
          this.focusEmail = true;
          this.selectCliente(this.cs.clientes[ind]);
        }
      } else {
        this.searchBox.nativeElement.focus();
      }
    });
  }

  selectCliente(cliente: Cliente): void {
    this.start = false;
    this.selectedClient = cliente;
    this.form.patchValue(this.selectedClient.toInterface(false));
    this.selectedIndex = 0;
    this.clienteTabs.realignInkBar();
    this.cs
      .getEstadisticasCliente(this.selectedClient.id)
      .subscribe((result) => {
        if (result.status === "ok") {
          this.selectedClient.ultimasVentas = this.cms.getUltimaVentaArticulos(
            result.ultimasVentas
          );
          this.selectedClient.topVentas = this.cms.getTopVentaArticulos(
            result.topVentas
          );
        }
      });
    this.loadFacturasCliente();
    setTimeout(() => {
      if (!this.focusEmail) {
        this.nameBox.nativeElement.focus();
      } else {
        this.focusEmail = false;
        this.emailBox.nativeElement.focus();
      }
    });
  }

  loadFacturasCliente(): void {
    this.cs.getFacturas(this.selectedClient.id).subscribe((result) => {
      if (result.status === "ok") {
        this.selectedClient.facturas = this.cms.getFacturas(result.list);
        this.facturasDataSource.data = this.selectedClient.facturas;
      }
    });
  }

  newCliente(): void {
    this.start = false;
    this.selectedClient = new Cliente();
    this.form.patchValue(this.selectedClient.toInterface(false));
    this.selectedIndex = 0;
    this.clienteTabs.realignInkBar();
    setTimeout(() => {
      this.nameBox.nativeElement.focus();
    });
  }

  resetForm(): void {
    this.form.reset();
    this.form.patchValue(this.selectedClient.toInterface(false));
  }

  onSubmit(): void {
    this.selectedClient.fromInterface(this.form.value, false);
    this.cs
      .saveCliente(this.selectedClient.toInterface())
      .subscribe((result) => {
        this.cs.resetClientes();
        this.resetForm();
        this.dialog
          .alert({
            title: "Datos guardados",
            content:
              'Los datos del cliente "' +
              this.selectedClient.nombreApellidos +
              '" han sido correctamente guardados.',
            ok: "Continuar",
          })
          .subscribe((result) => {});
      });
  }

  deleteCliente(): void {
    this.dialog
      .confirm({
        title: "Confirmar",
        content:
          '¿Estás seguro de querer borrar el cliente "' +
          this.selectedClient.nombreApellidos +
          '"? Las ventas realizadas al cliente no se borrarán, se borrarán los datos del cliente y que dichas ventas fueron realizadas por él',
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result) => {
        if (result === true) {
          this.confirmDeleteCliente();
        }
      });
  }

  confirmDeleteCliente(): void {
    this.cs.deleteCliente(this.selectedClient.id).subscribe((result) => {
      this.cs.resetClientes();
      this.start = true;
      this.dialog
        .alert({
          title: "Cliente borrado",
          content:
            'El cliente "' +
            this.selectedClient.nombreApellidos +
            '" ha sido correctamente borrado.',
          ok: "Continuar",
        })
        .subscribe((result) => {});
    });
  }

  imprimirLOPD(): void {
    window.open("/lopd/" + this.selectedClient.id);
  }

  nuevaFactura(): void {
    if (
      this.selectedClient.dniCif === null ||
      this.selectedClient.dniCif === ""
    ) {
      this.dialog
        .alert({
          title: "Error",
          content:
            'El cliente "' +
            this.selectedClient.nombreApellidos +
            '" no tiene DNI/CIF introducido por lo que no se le puede crear una factura.',
          ok: "Continuar",
        })
        .subscribe((result) => {});
    } else {
      if (
        this.selectedClient.direccion === null ||
        this.selectedClient.direccion === "" ||
        this.selectedClient.codigoPostal === null ||
        this.selectedClient.codigoPostal === "" ||
        this.selectedClient.poblacion === null ||
        this.selectedClient.poblacion === "" ||
        this.selectedClient.provincia === null
      ) {
        this.dialog
          .confirm({
            title: "Confirmar",
            content:
              'El cliente "' +
              this.selectedClient.nombreApellidos +
              '" no tiene dirección introducida. ¿Quieres continuar?',
            ok: "Continuar",
            cancel: "Cancelar",
          })
          .subscribe((result) => {
            if (result === true) {
              this.openNuevaFactura(this.selectedClient);
            }
          });
      } else {
        this.openNuevaFactura(this.selectedClient);
      }
    }
  }

  openNuevaFactura(cliente: Cliente): void {
    const modalnewProveedorData: FacturaModal = {
      modalTitle: "Nueva factura",
      modalColor: "blue",
      css: "modal-wide",
      id: cliente.id,
      factura: null,
    };
    const dialog = this.overlayService.open(
      EditFacturaModalComponent,
      modalnewProveedorData
    );
    dialog.afterClosed$.subscribe((data) => {
      if (data.data !== null) {
        this.loadFacturasCliente();
      }
    });
  }

  selectFactura(ind: number): void {
    const modalnewProveedorData: FacturaModal = {
      modalTitle: "Factura " + this.facturasDataSource.data[ind].id,
      modalColor: "blue",
      css: "modal-wide",
      id: null,
      factura: this.facturasDataSource.data[ind],
    };
    const dialog = this.overlayService.open(
      EditFacturaModalComponent,
      modalnewProveedorData
    );
    dialog.afterClosed$.subscribe((data) => {
      if (data.data !== null) {
        this.loadFacturasCliente();
      }
    });
  }

  enviarFactura(ev: MouseEvent, factura: Factura): void {
    ev && ev.stopPropagation();
    this.dialog
      .confirm({
        title: "Confirmar",
        content:
          '¿Estás seguro de querer enviar la factura "' +
          factura.id +
          '" al cliente "' +
          this.selectedClient.nombreApellidos +
          " (" +
          this.selectedClient.email +
          ')"?',
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result) => {
        if (result === true) {
          this.confirmEnviarFactura(factura.id);
        }
      });
  }

  confirmEnviarFactura(id: number): void {
    this.cs.sendFactura(id).subscribe((result) => {
      if (result.status === "ok") {
        this.dialog
          .alert({
            title: "Factura enviada",
            content: "La factura ha sido correctamente enviada.",
            ok: "Continuar",
          })
          .subscribe((result) => {});
      } else {
        this.dialog
          .alert({
            title: "Error",
            content:
              'Ocurrió un error al intentar enviar la factura a la dirección "' +
              this.selectedClient.email +
              '".',
            ok: "Continuar",
          })
          .subscribe((result) => {});
      }
    });
  }

  imprimirFactura(ev: MouseEvent, factura: Factura): void {
    ev && ev.stopPropagation();
    window.open("/factura/" + factura.id);
  }
}
