import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { EmpleadoLoginInterface } from '@interfaces/empleado.interface';
import { StatusResult } from '@interfaces/interfaces';
import { CustomOverlayRef, DialogService } from '@osumi/angular-tools';
import EmpleadosService from '@services/empleados.service';

@Component({
  selector: 'otpv-employee-login-modal',
  templateUrl: './employee-login-modal.component.html',
  styleUrls: ['./employee-login-modal.component.scss'],
  imports: [FormsModule, MatFormField, MatInput, MatLabel, MatButton],
})
export default class EmployeeLoginModalComponent implements OnInit {
  private dialog: DialogService = inject(DialogService);
  private es: EmpleadosService = inject(EmpleadosService);
  private customOverlayRef: CustomOverlayRef<
    null,
    { id: number; nombre: string }
  > = inject(CustomOverlayRef);

  id: number = null;
  nombre: string = null;
  pass: string = null;
  @ViewChild('loginPasswordValue', { static: true })
  loginPasswordValue: ElementRef;
  loginLoading: boolean = false;

  ngOnInit(): void {
    this.id = this.customOverlayRef.data.id;
    this.nombre = this.customOverlayRef.data.nombre;
    setTimeout((): void => {
      this.loginPasswordValue.nativeElement.focus();
    }, 0);
  }

  checkLoginPassword(ev: KeyboardEvent): void {
    if (ev.key == 'Enter') {
      this.login();
    }
  }

  login(): void {
    if (this.pass === '') {
      this.dialog
        .alert({
          title: 'Error',
          content: '¡No puedes dejar la contraseña en blanco!',
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
        if (result.status === 'ok') {
          this.customOverlayRef.close(true);
        } else {
          this.dialog
            .alert({
              title: 'Error',
              content: 'Contraseña incorrecta.',
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
