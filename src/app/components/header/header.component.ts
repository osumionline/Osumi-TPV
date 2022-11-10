import { Component, HostListener, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ConfigService } from "src/app/services/config.service";

@Component({
  selector: "otpv-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  @Input() selectedOption: string = "";
  title: string;

  constructor(private cs: ConfigService, private router: Router) {}

  ngOnInit(): void {
    this.title = this.cs.nombre;
  }

  @HostListener("window:keydown", ["$event"])
  onKeyDown(ev: KeyboardEvent): void {
    const options: string[] = ["F5", "F6", "F7", "F8", "F9", "F10"];
    if (options.includes(ev.key)) {
      ev.preventDefault();
      this.goTo(ev.key);
    }
  }

  goTo(where: string): void {
    const whereTo: {
      [key: string]: string;
    } = {
      F5: "/ventas",
      F6: "/articulos",
      F7: "/compras",
      F8: "/clientes",
      F9: "/almacen",
      F10: "/gestion",
    };
    this.router.navigate([whereTo[where]]);
  }
}
