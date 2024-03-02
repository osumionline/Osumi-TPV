import { Component, ModelSignal, model } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatFormField } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { Articulo } from "src/app/model/articulos/articulo.model";

@Component({
  selector: "otpv-un-articulo-observaciones",
  standalone: true,
  imports: [MatFormField, MatInput, MatSlideToggle, FormsModule],
  templateUrl: "./un-articulo-observaciones.component.html",
  styleUrl: "../un-articulo/un-articulo.component.scss",
})
export class UnArticuloObservacionesComponent {
  articulo: ModelSignal<Articulo> = model.required<Articulo>();
}
