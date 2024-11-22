import { NgStyle } from '@angular/common';
import { Component, OutputEmitterRef, inject, output } from '@angular/core';
import { EmpleadoLoginModal } from '@interfaces/modals.interface';
import Empleado from '@model/tpv/empleado.model';
import { OverlayService } from '@osumi/angular-tools';
import EmpleadosService from '@services/empleados.service';
import EmployeeLoginModalComponent from '@shared/components/modals/employee-login-modal/employee-login-modal.component';

@Component({
  selector: 'otpv-employee-login',
  templateUrl: './employee-login.component.html',
  styleUrls: ['./employee-login.component.scss'],
  imports: [NgStyle],
})
export default class EmployeeLoginComponent {
  public es: EmpleadosService = inject(EmpleadosService);
  private overlayService: OverlayService = inject(OverlayService);

  selectedEmpleado: Empleado = new Empleado();
  successEvent: OutputEmitterRef<Empleado> = output<Empleado>();

  abreLogin(empleado: Empleado): void {
    this.selectedEmpleado = empleado;
    this.selectedEmpleado.pass = '';

    const modalEmpleadoLoginData: EmpleadoLoginModal = {
      modalTitle: 'Iniciar sesión',
      modalColor: 'blue',
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
