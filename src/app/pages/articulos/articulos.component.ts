import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Articulo } from "src/app/model/articulos/articulo.model";
import { ArticulosService } from "src/app/services/articulos.service";

@Component({
  selector: "otpv-articulos",
  templateUrl: "./articulos.component.html",
  styleUrls: ["./articulos.component.scss"],
})
export class ArticulosComponent implements OnInit {
  constructor(
    public ars: ArticulosService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      if (params.localizador && parseInt(params.localizador) !== 0) {
        const ind: number = this.ars.list.findIndex((x: Articulo): boolean => {
          return x.localizador === parseInt(params.localizador);
        });
        if (ind !== -1) {
          this.ars.selected = ind;
        } else {
          this.ars.newArticulo(parseInt(params.localizador));
        }
        this.router.navigate(["/articulos"]);
      }
      if (this.ars.list.length === 0) {
        this.ars.newArticulo();
      }
    });
  }

  duplicar(articulo: Articulo): void {
    articulo.id = null;
    articulo.localizador = null;
    articulo.tabName = "ARTÍCULO " + (this.ars.list.length + 1);
    articulo.nombre += " (copia)";
    articulo.referencia = "";
    articulo.codigosBarras = [];
    articulo.fechaCaducidad = null;
    articulo.stock = 0;
    articulo.status = "loaded";
    articulo.observaciones = "";
    this.ars.list.push(articulo);
    this.ars.selected = this.ars.list.length - 1;
  }
}
