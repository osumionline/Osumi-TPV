import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatTabChangeEvent, MatTabGroup } from "@angular/material/tabs";
import { Router } from "@angular/router";
import { SelectClienteInterface } from "src/app/interfaces/cliente.interface";
import { ProvinceInterface } from "src/app/interfaces/interfaces";
import { Cliente } from "src/app/model/cliente.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ClientesService } from "src/app/services/clientes.service";
import { ConfigService } from "src/app/services/config.service";
import { DialogService } from "src/app/services/dialog.service";
import { EmpleadosService } from "src/app/services/empleados.service";
import { VentasService } from "src/app/services/ventas.service";

@Component({
  selector: "otpv-tabs",
  templateUrl: "./tabs.component.html",
  styleUrls: ["./tabs.component.scss"],
})
export class TabsComponent implements AfterViewInit {
  @Input() showClose: boolean = false;
  @Output() closeTabEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() newTabEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() changeTabEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() selectClientEvent: EventEmitter<SelectClienteInterface> =
    new EventEmitter<SelectClienteInterface>();

  mostrarElegirCliente: boolean = false;
  @ViewChild("elegirClienteTabs", { static: false })
  elegirClienteTabs: MatTabGroup;
  elegirClienteSelectedTab: number = 0;
  elegirClienteNombre: string = "";
  @ViewChild("elegirClienteBoxName", { static: true })
  elegirClienteBoxName: ElementRef;
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
  provincias: ProvinceInterface[] = [];
  nuevoClienteSaving: boolean = false;
  selectClienteFrom: string = null;

  constructor(
    public config: ConfigService,
    private dialog: DialogService,
    private cms: ClassMapperService,
    private cs: ClientesService,
    public vs: VentasService,
    public es: EmpleadosService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.buscadorDataSource.sort = this.sort;
  }

  @HostListener("window:keydown", ["$event"])
  onKeyDown(ev: KeyboardEvent): void {
    if (ev.key === "Escape") {
      if (this.mostrarElegirCliente) {
        this.cerrarElegirCliente();
      }
    }
  }

  selectTab(ind: number): void {
    this.vs.selected = ind;
    this.changeTabEvent.emit(ind);
  }

  closeTab(ind: number): void {
    this.dialog
      .confirm({
        title: "Confirmar",
        content: "¿Estás seguro de querer cerrar esta venta?",
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result) => {
        if (result === true) {
          this.closeTabEvent.emit(ind);
        }
      });
  }

  newTab(): void {
    this.newTabEvent.emit(0);
  }

  selectClient(from: string = null): void {
    this.mostrarElegirCliente = true;
    this.elegirClienteTabs.realignInkBar();
    this.elegirClienteSelectedTab = 0;
    this.elegirClienteNombre = "";
    this.searching = false;
    this.searched = false;
    this.nuevoCliente = new Cliente();
    this.selectClienteFrom = from;
    setTimeout(() => {
      this.elegirClienteBoxName.nativeElement.focus();
    }, 0);
  }

  cerrarElegirCliente(ev: MouseEvent = null): void {
    ev && ev.preventDefault();
    this.mostrarElegirCliente = false;
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
    if (this.nuevoCliente.dniCif === null || this.nuevoCliente.dniCif === "") {
      this.dialog.alert({
        title: "Error",
        content: "¡No puedes dejar en blanco el DNI o CIF del cliente!",
        ok: "Continuar",
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
      if (
        this.nuevoCliente.dniCif === null ||
        this.nuevoCliente.dniCif === ""
      ) {
        this.dialog.alert({
          title: "Error",
          content:
            "¡No puedes dejar en blanco el DNI o CIF del cliente para la facturación!",
          ok: "Continuar",
        });
        return;
      }
    }
    this.searching = true;
    this.cs.saveCliente(this.nuevoCliente.toInterface()).subscribe((result) => {
      if (result.status === "ok") {
        this.nuevoCliente.id = result.id;
        this.selectCliente(this.nuevoCliente);
      } else {
        this.dialog.alert({
          title: "Error",
          content: "¡Ocurrió un error al guardar el cliente!",
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
    } else {
      this.vs.cliente = cliente;
      this.cerrarElegirCliente();
      this.cs.getEstadisticasCliente(cliente.id).subscribe((result) => {
        if (result.status === "ok") {
          this.vs.cliente.ultimasVentas = this.cms.getUltimaVentaArticulos(
            result.ultimasVentas
          );
          this.vs.cliente.topVentas = this.cms.getTopVentaArticulos(
            result.topVentas
          );
        } else {
          this.dialog.alert({
            title: "Error",
            content:
              "¡Ocurrió un error al obtener las estadísticas del cliente!",
            ok: "Continuar",
          });
        }
      });
      this.selectClientEvent.emit({
        id: cliente.id,
        from: this.selectClienteFrom,
      });
    }
  }

  removeClient(): void {
    this.vs.cliente = null;
    this.selectClientEvent.emit(null);
  }
}
