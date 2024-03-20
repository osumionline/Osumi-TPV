import { NgStyle } from "@angular/common";
import { Component, OutputEmitterRef, output } from "@angular/core";
import { EmpleadoLoginModal } from "@interfaces/modals.interface";
import { Empleado } from "@model/tpv/empleado.model";
import { EmpleadosService } from "@services/empleados.service";
import { OverlayService } from "@services/overlay.service";
import { EmployeeLoginModalComponent } from "@shared/components/modals/employee-login-modal/employee-login-modal.component";

@Component({
  standalone: true,
  selector: "otpv-employee-login",
  templateUrl: "./employee-login.component.html",
  styleUrls: ["./employee-login.component.scss"],
  imports: [NgStyle],
})
export class EmployeeLoginComponent {
  selectedEmpleado: Empleado = new Empleado();
  successEvent: OutputEmitterRef<Empleado> = output<Empleado>();

  constructor(
    public es: EmpleadosService,
    private overlayService: OverlayService
  ) {}

  abreLogin(empleado: Empleado): void {
    this.selectedEmpleado = empleado;
    this.selectedEmpleado.pass = "";

    const modalEmpleadoLoginData: EmpleadoLoginModal = {
      modalTitle: "Iniciar sesión",
      modalColor: "blue",
      id: this.selectedEmpleado.id,
      nombre: this.selectedEmpleado.nombre,
    };
    const dialog = this.overlayService.open(
      EmployeeLoginModalComponent,
      modalEmpleadoLoginData
    );
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data === true) {
        this.successEvent.emit(this.selectedEmpleado);
      }
    });
  }
}
