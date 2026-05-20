import { Component, OutputEmitterRef, WritableSignal, inject, output, signal } from '@angular/core';
import { EmpleadoLoginModal, EmpleadoLoginModalResult } from '@interfaces/modals.interface';
import Empleado from '@model/tpv/empleado.model';
import { OverlayService } from '@osumi/angular-tools';
import EmpleadosService from '@services/empleados.service';
import EmployeeLoginModalComponent from '@shared/modals/employee-login-modal/employee-login-modal.component';

@Component({
  selector: 'otpv-employee-login',
  templateUrl: './employee-login.component.html',
  styleUrls: ['./employee-login.component.scss'],
  imports: [],
})
export default class EmployeeLoginComponent {
  private readonly es: EmpleadosService = inject(EmpleadosService);
  private readonly overlayService: OverlayService = inject(OverlayService);

  empleados: WritableSignal<Empleado[]> = signal<Empleado[]>([...this.es.empleados()]);
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
    const dialog = this.overlayService.open<EmpleadoLoginModalResult>(
      EmployeeLoginModalComponent,
      modalEmpleadoLoginData,
      [],
      true,
      document.getElementById(`empleado_${empleado.id}`) as HTMLElement,
    );
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data !== null && data.data.result === true) {
        this.successEvent.emit(this.selectedEmpleado);
      }
    });
  }
}
