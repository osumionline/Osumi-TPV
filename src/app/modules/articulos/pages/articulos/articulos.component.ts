import { NgClass } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Articulo } from "@model/articulos/articulo.model";
import { ArticulosTabsComponent } from "@modules/articulos/components/articulos-tabs/articulos-tabs.component";
import { UnArticuloComponent } from "@modules/articulos/components/un-articulo/un-articulo.component";
import { ArticulosService } from "@services/articulos.service";
import { HeaderComponent } from "@shared/components/header/header.component";

@Component({
  standalone: true,
  selector: "otpv-articulos",
  templateUrl: "./articulos.component.html",
  styleUrls: ["./articulos.component.scss"],
  imports: [
    NgClass,
    HeaderComponent,
    ArticulosTabsComponent,
    UnArticuloComponent,
  ],
})
export default class ArticulosComponent implements OnInit {
  @ViewChild("tabs", { static: true }) tabs: ArticulosTabsComponent;
  loaded: boolean = false;

  constructor(
    public ars: ArticulosService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      if (params.localizador) {
        if (parseInt(params.localizador) !== 0) {
          const ind: number = this.ars.list.findIndex(
            (x: Articulo): boolean => {
              return x.localizador === parseInt(params.localizador);
            }
          );
          if (ind !== -1) {
            this.ars.selected = ind;
          } else {
            this.ars.newArticulo(parseInt(params.localizador));
          }
          this.router.navigate(["/articulos"]);
        } else {
          this.tabs.newTab();
        }
      }
      if (this.ars.list.length === 0) {
        this.ars.newArticulo();
      }
      this.loaded = true;
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

  cerrar(ind: number): void {
    this.tabs.closeTab(ind);
  }
}
