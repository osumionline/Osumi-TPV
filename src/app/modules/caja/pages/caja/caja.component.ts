import { Component } from "@angular/core";
import { MatCard, MatCardContent } from "@angular/material/card";
import { CajaContentComponent } from "src/app/modules/shared/components/caja/caja-content/caja-content.component";
import { HeaderComponent } from "src/app/modules/shared/components/header/header.component";

@Component({
  standalone: true,
  selector: "otpv-caja",
  templateUrl: "./caja.component.html",
  styleUrls: ["./caja.component.scss"],
  imports: [HeaderComponent, CajaContentComponent, MatCard, MatCardContent],
})
export default class CajaComponent {}
