import { Component, ModelSignal, model } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { MatFormField } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { Articulo } from "src/app/model/articulos/articulo.model";
import { Foto } from "src/app/model/articulos/foto.model";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  selector: "otpv-un-articulo-web",
  standalone: true,
  imports: [
    MatSlideToggle,
    MatFormField,
    MatInput,
    FormsModule,
    MatIcon,
    MatButton,
  ],
  templateUrl: "./un-articulo-web.component.html",
  styleUrl: "../un-articulo/un-articulo.component.scss",
})
export class UnArticuloWebComponent {
  articulo: ModelSignal<Articulo> = model.required<Articulo>();

  constructor(private dialog: DialogService) {}

  addFoto(): void {
    document.getElementById("foto-file").click();
  }

  onFotoChange(ev: Event): void {
    const reader: FileReader = new FileReader();
    if (
      (<HTMLInputElement>ev.target).files &&
      (<HTMLInputElement>ev.target).files.length > 0
    ) {
      const file = (<HTMLInputElement>ev.target).files[0];
      reader.readAsDataURL(file);
      reader.onload = (): void => {
        const foto: Foto = new Foto();
        foto.load(reader.result as string);
        this.articulo.update((value: Articulo): Articulo => {
          value.fotosList.push(foto);
          return value;
        });
        (<HTMLInputElement>document.getElementById("foto-file")).value = "";
      };
    }
  }

  deleteFoto(i: number): void {
    this.dialog
      .confirm({
        title: "Confirmar",
        content: "¿Estás seguro de querer borrar esta foto?",
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.articulo.update((value: Articulo): Articulo => {
            if (value.fotosList[i].status === "ok") {
              value.fotosList[i].status = "deleted";
            }
            if (value.fotosList[i].status === "new") {
              value.fotosList.splice(i, 1);
            }
            return value;
          });
        }
      });
  }

  moveFoto(sent: string, i: number): void {
    let aux: Foto = null;
    if (sent === "left") {
      if (i === 0) {
        return;
      }
      this.articulo.update((value: Articulo): Articulo => {
        aux = value.fotosList[i];
        value.fotosList[i] = value.fotosList[i - 1];
        value.fotosList[i - 1] = aux;
        return value;
      });
    } else {
      if (i === this.articulo().fotosList.length - 1) {
        return;
      }
      this.articulo.update((value: Articulo): Articulo => {
        aux = value.fotosList[i];
        value.fotosList[i] = value.fotosList[i + 1];
        value.fotosList[i + 1] = aux;
        return value;
      });
    }
  }
}
