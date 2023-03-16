import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatTabChangeEvent, MatTabGroup } from "@angular/material/tabs";
import { Router } from "@angular/router";
import { Cliente } from "src/app/model/clientes/cliente.model";
import { CustomOverlayRef } from "src/app/model/tpv/custom-overlay-ref.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ClientesService } from "src/app/services/clientes.service";
import { ConfigService } from "src/app/services/config.service";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  standalone: true,
  selector: "otpv-elegir-cliente-modal",
  templateUrl: "./elegir-cliente-modal.component.html",
  styleUrls: ["./elegir-cliente-modal.component.scss"],
  imports: [CommonModule, MaterialModule, FormsModule, MatSortModule],
})
export class ElegirClienteModalComponent implements OnInit, AfterViewInit {
  selectClienteFrom: string = null;
  @ViewChild("elegirClienteTabs", { static: false })
  elegirClienteTabs: MatTabGroup;
  @ViewChild("elegirClienteBoxName", { static: true })
  elegirClienteBoxName: ElementRef;
  elegirClienteSelectedTab: number = 0;
  elegirClienteNombre: string = "";
  searchTimer: number = null;
  searching: boolean = false;
  searched: boolean = false;
  searchResult: Cliente[] = [];

  buscadorDisplayedColumns: string[] = [
    "nombreApellidos",
    "telefono",
    "ultimaVenta",
  ];
  buscadorDataSource: MatTableDataSource<Cliente> =
    new MatTableDataSource<Cliente>();
  @ViewChild(MatSort) sort: MatSort;

  nuevoCliente: Cliente = new Cliente();
  @ViewChild("nuevoClienteBoxName", { static: true })
  nuevoClienteBoxName: ElementRef;
  nuevoClienteSaving: boolean = false;

  constructor(
    public config: ConfigService,
    private dialog: DialogService,
    private cms: ClassMapperService,
    private cs: ClientesService,
    private router: Router,
    private customOverlayRef: CustomOverlayRef<null, { from: string }>
  ) {}

  ngOnInit(): void {
    this.selectClienteFrom = this.customOverlayRef.data.from;
    this.elegirClienteSelectedTab = 0;
    this.elegirClienteNombre = "";
    this.searching = false;
    this.searched = false;
    this.nuevoCliente = new Cliente();
    setTimeout(() => {
      this.elegirClienteBoxName.nativeElement.focus();
    }, 0);
  }

  ngAfterViewInit(): void {
    this.buscadorDataSource.sort = this.sort;
    this.elegirClienteTabs.realignInkBar();
  }

  changeClienteTab(ev: MatTabChangeEvent): void {
    if (ev.index === 0) {
      this.elegirClienteBoxName.nativeElement.focus();
    }
    if (ev.index === 1) {
      this.nuevoClienteBoxName.nativeElement.focus();
    }
  }

  searchStart(): void {
    clearTimeout(this.searchTimer);
    this.searchTimer = window.setTimeout(() => {
      this.searchClientes();
    }, 500);
  }

  searchClientes(): void {
    if (this.searching) {
      return;
    }
    this.searchResult = [];
    if (this.elegirClienteNombre === null || this.elegirClienteNombre === "") {
      return;
    }
    this.searching = true;
    this.cs.searchClientes(this.elegirClienteNombre).subscribe((result) => {
      this.searching = false;
      this.searched = true;
      if (result.status === "ok") {
        this.searchResult = this.cms.getClientes(result.list);
        this.buscadorDataSource.data = this.searchResult;
      } else {
        this.dialog.alert({
          title: "Error",
          content: "Ocurrió un error al buscar los clientes.",
          ok: "Continuar",
        });
      }
    });
  }

  selectCliente(cliente: Cliente): void {
    if (
      this.selectClienteFrom === "venta" &&
      (cliente.email === null || cliente.email === "")
    ) {
      this.dialog
        .confirm({
          title: "Elegir cliente",
          content:
            "El cliente seleccionado no tiene ningún email asignado. ¿Quieres seleccionar otro cliente o quieres ir a su ficha para poder añadirselo?",
          ok: "Ir a su ficha",
          cancel: "Elegir otro cliente",
        })
        .subscribe((result) => {
          if (result === true) {
            this.router.navigate(["/clientes/" + cliente.id]);
          }
        });
      return;
    }

    this.customOverlayRef.close(cliente);
  }

  saveNuevoCliente(): void {
    if (
      this.nuevoCliente.nombreApellidos === null ||
      this.nuevoCliente.nombreApellidos === ""
    ) {
      this.dialog
        .alert({
          title: "Error",
          content: "¡No puedes dejar en blanco el nombre del cliente!",
          ok: "Continuar",
        })
        .subscribe((result) => {
          this.nuevoClienteBoxName.nativeElement.focus();
        });
      return;
    }
    if (this.nuevoCliente.factIgual) {
      if (
        this.nuevoCliente.nombreApellidos === null ||
        this.nuevoCliente.nombreApellidos === ""
      ) {
        this.dialog.alert({
          title: "Error",
          content:
            "¡No puedes dejar en blanco el nombre del cliente para la facturación!",
          ok: "Continuar",
        });
        return;
      }
    }
    this.searching = true;
    this.cs.saveCliente(this.nuevoCliente.toInterface()).subscribe((result) => {
      if (result.status === "ok") {
        this.cs.resetClientes();
        this.nuevoCliente.id = result.id;
        this.selectCliente(this.nuevoCliente);
        window.open("/clientes/lopd/" + result.id);
      } else {
        this.dialog.alert({
          title: "Error",
          content: "¡Ocurrió un error al guardar el cliente!",
          ok: "Continuar",
        });
      }
    });
  }
}
