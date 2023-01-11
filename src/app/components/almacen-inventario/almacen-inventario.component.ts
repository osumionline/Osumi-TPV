import { Component, OnInit } from "@angular/core";
import { BuscadorAlmacenInterface } from "src/app/interfaces/almacen.interface";
import { AlmacenService } from "src/app/services/almacen.service";
import { MarcasService } from "src/app/services/marcas.service";
import { ProveedoresService } from "src/app/services/proveedores.service";

@Component({
  selector: "otpv-almacen-inventario",
  templateUrl: "./almacen-inventario.component.html",
  styleUrls: ["./almacen-inventario.component.scss"],
})
export class AlmacenInventarioComponent implements OnInit {
  buscador: BuscadorAlmacenInterface = {
    idProveedor: null,
    idMarca: null,
    nombre: null,
    orderBy: null,
    orderSent: null,
    pagina: 1,
  };

  constructor(
    public ms: MarcasService,
    public ps: ProveedoresService,
    private as: AlmacenService
  ) {}

  ngOnInit(): void {}
}
