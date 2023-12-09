import { CommonModule } from "@angular/common";
import { Component, HostListener, Input, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router, RouterModule } from "@angular/router";
import { CajaModal } from "src/app/interfaces/modals.interface";
import { CajaModalComponent } from "src/app/modules/caja/components/modals/caja-modal/caja-modal.component";
import { ConfigService } from "src/app/services/config.service";
import { OverlayService } from "src/app/services/overlay.service";

@Component({
  standalone: true,
  selector: "otpv-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  imports: [CommonModule, RouterModule, MatToolbarModule, MatIconModule],
})
export class HeaderComponent implements OnInit {
  @Input() selectedOption: string = "";
  title: string;

  constructor(
    private config: ConfigService,
    private router: Router,
    private overlayService: OverlayService
  ) {}

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
      this.abrirCaja("historico");
    }
    if (ev.key === "F11") {
      ev.preventDefault();
      this.abrirCaja("salidas");
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

  abrirCaja(option: string = "historico"): void {
    const modalCajaData: CajaModal = {
      modalTitle: "Caja",
      modalColor: "blue",
      css: "modal-wide",
      option: option,
    };
    this.overlayService.open(CajaModalComponent, modalCajaData);
  }
}
