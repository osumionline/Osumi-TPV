import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { EmpleadoLoginInterface } from "@interfaces/empleado.interface";
import { StatusResult } from "@interfaces/interfaces";
import { CustomOverlayRef } from "@model/tpv/custom-overlay-ref.model";
import { DialogService } from "@services/dialog.service";
import { EmpleadosService } from "@services/empleados.service";

@Component({
  standalone: true,
  selector: "otpv-employee-login-modal",
  templateUrl: "./employee-login-modal.component.html",
  styleUrls: ["./employee-login-modal.component.scss"],
  imports: [FormsModule, MatFormField, MatInput, MatLabel, MatButton],
})
export class EmployeeLoginModalComponent implements OnInit {
  id: number = null;
  nombre: string = null;
  pass: string = null;
  @ViewChild("loginPasswordValue", { static: true })
  loginPasswordValue: ElementRef;
  loginLoading: boolean = false;

  constructor(
    private dialog: DialogService,
    private es: EmpleadosService,
    private customOverlayRef: CustomOverlayRef<
      null,
      { id: number; nombre: string }
    >
  ) {}

  ngOnInit(): void {
    this.id = this.customOverlayRef.data.id;
    this.nombre = this.customOverlayRef.data.nombre;
    setTimeout((): void => {
      this.loginPasswordValue.nativeElement.focus();
    }, 0);
  }

  checkLoginPassword(ev: KeyboardEvent): void {
    if (ev.key == "Enter") {
      this.login();
    }
  }

  login(): void {
    if (this.pass === "") {
      this.dialog
        .alert({
          title: "Error",
          content: "¡No puedes dejar la contraseña en blanco!",
          ok: "Continuar",
        })
        .subscribe((): void => {
          setTimeout((): void => {
            this.loginPasswordValue.nativeElement.focus();
          }, 0);
        });
    } else {
      this.loginLoading = true;
      const empleado: EmpleadoLoginInterface = {
        id: this.id,
        pass: this.pass,
      };
      this.es.login(empleado).subscribe((result: StatusResult): void => {
        this.loginLoading = false;
        if (result.status === "ok") {
          this.customOverlayRef.close(true);
        } else {
          this.dialog
            .alert({
              title: "Error",
              content: "Contraseña incorrecta.",
              ok: "Continuar",
            })
            .subscribe((): void => {
              setTimeout((): void => {
                this.loginPasswordValue.nativeElement.focus();
              }, 0);
            });
        }
      });
    }
  }
}
