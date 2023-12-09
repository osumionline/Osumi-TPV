import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";
import { EmpleadoLoginModal } from "src/app/interfaces/modals.interface";
import { Empleado } from "src/app/model/tpv/empleado.model";
import { EmployeeLoginModalComponent } from "src/app/modules/shared/components/modals/employee-login-modal/employee-login-modal.component";
import { EmpleadosService } from "src/app/services/empleados.service";
import { OverlayService } from "src/app/services/overlay.service";

@Component({
  standalone: true,
  selector: "otpv-employee-login",
  templateUrl: "./employee-login.component.html",
  styleUrls: ["./employee-login.component.scss"],
  imports: [CommonModule],
})
export class EmployeeLoginComponent {
  selectedEmpleado: Empleado = new Empleado();
  @Output() successEvent: EventEmitter<Empleado> = new EventEmitter<Empleado>();

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
