import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Empleado } from "src/app/model/empleado.model";
import { DialogService } from "src/app/services/dialog.service";
import { EmpleadosService } from "src/app/services/empleados.service";

@Component({
  selector: "otpv-employee-login",
  templateUrl: "./employee-login.component.html",
  styleUrls: ["./employee-login.component.scss"],
})
export class EmployeeLoginComponent implements OnInit {
  muestraLogin: boolean = false;
  selectedEmpleado: Empleado = new Empleado();
  @ViewChild("loginPasswordValue", { static: true })
  loginPasswordValue: ElementRef;
  loginLoading: boolean = false;
  @Output() successEvent: EventEmitter<Empleado> = new EventEmitter<Empleado>();

  constructor(private dialog: DialogService, public es: EmpleadosService) {}

  ngOnInit(): void {}

  @HostListener("window:keydown", ["$event"])
  onKeyDown(ev: KeyboardEvent): void {
    if (ev.key === "Escape") {
      if (this.muestraLogin && !this.loginLoading) {
        this.cerrarLogin();
      }
    }
  }

  abreLogin(empleado: Empleado): void {
    this.selectedEmpleado = empleado;
    this.selectedEmpleado.pass = "";
    this.muestraLogin = true;
    setTimeout(() => {
      this.loginPasswordValue.nativeElement.focus();
    }, 0);
  }

  cerrarLogin(ev: MouseEvent = null): void {
    ev && ev.preventDefault();
    this.muestraLogin = false;
  }

  checkLoginPassword(ev: KeyboardEvent): void {
    if (ev.key == "Enter") {
      this.login();
    }
  }

  login(): void {
    if (this.selectedEmpleado.pass === "") {
      this.dialog
        .alert({
          title: "Error",
          content: "¡No puedes dejar la contraseña en blanco!",
          ok: "Continuar",
        })
        .subscribe((result) => {
          setTimeout(() => {
            this.loginPasswordValue.nativeElement.focus();
          }, 0);
        });
    } else {
      this.loginLoading = true;
      this.es
        .login(this.selectedEmpleado.toLoginInterface())
        .subscribe((result) => {
          this.loginLoading = false;
          if (result.status === "ok") {
            this.cerrarLogin();
            this.successEvent.emit(this.selectedEmpleado);
          } else {
            this.dialog
              .alert({
                title: "Error",
                content: "Contraseña incorrecta.",
                ok: "Continuar",
              })
              .subscribe((result) => {
                setTimeout(() => {
                  this.loginPasswordValue.nativeElement.focus();
                }, 0);
              });
          }
        });
    }
  }
}
