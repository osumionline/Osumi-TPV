import { Component } from "@angular/core";
import { MaterialModule } from "src/app/modules/material/material.module";
import { CajaContentComponent } from "src/app/modules/shared/components/caja/caja-content/caja-content.component";
import { HeaderComponent } from "src/app/modules/shared/components/header/header.component";

@Component({
  standalone: true,
  selector: "otpv-caja",
  templateUrl: "./caja.component.html",
  styleUrls: ["./caja.component.scss"],
  imports: [MaterialModule, HeaderComponent, CajaContentComponent],
})
export class CajaComponent {}
