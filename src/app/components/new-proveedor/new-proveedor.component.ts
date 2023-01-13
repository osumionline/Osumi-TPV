import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { Marca } from "src/app/model/marca.model";
import { Proveedor } from "src/app/model/proveedor.model";
import { DialogService } from "src/app/services/dialog.service";
import { MarcasService } from "src/app/services/marcas.service";
import { ProveedoresService } from "src/app/services/proveedores.service";

@Component({
  selector: "otpv-new-proveedor",
  templateUrl: "./new-proveedor.component.html",
  styleUrls: ["./new-proveedor.component.scss"],
})
export class NewProveedorComponent implements OnInit {
  @Output() savedEvent: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild("nombreBox", { static: true }) nombreBox: ElementRef;
  proveedor: Proveedor = new Proveedor();
  nuevoProveedor: boolean = false;
  marcasSelected: Marca[] = [];
  marcas: Marca[] = [];

  constructor(
    private ms: MarcasService,
    private dialog: DialogService,
    private ps: ProveedoresService
  ) {}

  ngOnInit(): void {
    this.marcas = this.ms.marcas;
  }

  @HostListener("window:keydown", ["$event"])
  onKeyDown(ev: KeyboardEvent) {
    if (ev.key === "Escape") {
      if (this.nuevoProveedor) {
        this.newProveedorCerrar();
      }
    }
  }

  newProveedor(): void {
    this.proveedor = new Proveedor();
    this.nuevoProveedor = true;
    setTimeout(() => {
      this.nombreBox.nativeElement.focus();
    });
  }

  newProveedorCerrar(ev: MouseEvent = null): void {
    ev && ev.preventDefault();
    this.nuevoProveedor = false;
  }

  removeMarcaToProveedor(marca: Marca, ev: MatCheckboxChange): void {
    const ind: number = this.marcasSelected.findIndex(
      (x: Marca): boolean => x.id == marca.id
    );

    if (!ev.checked) {
      if (ind !== -1) {
        this.marcas.push(marca);
        this.marcasSelected.splice(ind, 1);
        this.sortMarcasLists();
      }
    }
  }

  addMarcaToProveedor(marca: Marca, ev: MatCheckboxChange): void {
    const ind: number = this.marcas.findIndex(
      (x: Marca): boolean => x.id == marca.id
    );
    if (ev.checked) {
      if (ind !== -1) {
        this.marcasSelected.push(marca);
        this.marcas.splice(ind, 1);
        this.sortMarcasLists();
      }
    }
  }

  sortMarcasLists(): void {
    this.marcasSelected.sort((a: Marca, b: Marca) =>
      a.nombre > b.nombre ? 1 : b.nombre > a.nombre ? -1 : 0
    );
    this.marcas.sort((a: Marca, b: Marca) =>
      a.nombre > b.nombre ? 1 : b.nombre > a.nombre ? -1 : 0
    );
  }

  guardarProveedor(): void {
    if (!this.proveedor.nombre) {
      this.dialog
        .alert({
          title: "Error",
          content: "¡No puedes dejar el nombre del proveedor en blanco!",
          ok: "Continuar",
        })
        .subscribe((result) => {
          setTimeout(() => {
            this.nombreBox.nativeElement.focus();
          });
        });
      return;
    }

    if (this.marcasSelected.length == 0) {
      this.dialog
        .confirm({
          title: "Confirmar",
          content:
            "No has elegido ninguna marca para el proveedor, ¿quieres continuar?",
          ok: "Continuar",
          cancel: "Cancelar",
        })
        .subscribe((result) => {
          if (result === true) {
            this.guardarProveedorContinue();
          }
        });
    } else {
      this.proveedor.marcas = this.marcasSelected.map((m: Marca): number => {
        return m.id;
      });
      debugger;
      this.guardarProveedorContinue();
    }
  }

  guardarProveedorContinue(): void {
    this.ps.saveProveedor(this.proveedor.toInterface()).subscribe((result) => {
      if (result.status == "ok") {
        this.savedEvent.emit(result.id);
        this.ps.resetProveedores();
        this.newProveedorCerrar();
      } else {
        this.dialog
          .alert({
            title: "Error",
            content: "Ocurrió un error al guardar el nuevo proveedor",
            ok: "Continuar",
          })
          .subscribe((result) => {});
        return;
      }
    });
  }
}
