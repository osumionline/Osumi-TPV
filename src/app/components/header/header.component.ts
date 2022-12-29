import {
  Component,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { CajaComponent } from "src/app/components/caja/caja.component";
import { ConfigService } from "src/app/services/config.service";

@Component({
  selector: "otpv-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  @Input() selectedOption: string = "";
  title: string;
  @ViewChild("caja", { static: true }) caja: CajaComponent;

  constructor(private config: ConfigService, private router: Router) {}

  ngOnInit(): void {
    this.title = this.config.nombre;
  }

  @HostListener("window:keydown", ["$event"])
  onKeyDown(ev: KeyboardEvent): void {
    const options: string[] = ["F4", "F5", "F6", "F7", "F8", "F9"];
    if (options.includes(ev.key)) {
      ev.preventDefault();
      this.goTo(ev.key);
    }
    if (ev.key === "F10") {
      ev.preventDefault();
      this.abrirCaja();
    }
    if (ev.key === "F11") {
      ev.preventDefault();
      this.caja.abrirCaja("salidas");
    }
  }

  goTo(where: string): void {
    const whereTo: {
      [key: string]: string;
    } = {
      F4: "/ventas",
      F5: "/articulos",
      F6: "/compras",
      F7: "/clientes",
      F8: "/almacen",
      F9: "/gestion",
    };
    this.router.navigate([whereTo[where]]);
  }

  abrirCaja(): void {
    this.caja.abrirCaja("historico");
  }
}
