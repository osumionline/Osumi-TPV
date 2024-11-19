import { KeyValue, KeyValuePipe, NgClass, NgStyle } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatActionList, MatListItem } from '@angular/material/list';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { EmpleadoSaveInterface } from '@interfaces/empleado.interface';
import { StatusResult } from '@interfaces/interfaces';
import Empleado from '@model/tpv/empleado.model';
import { DialogService } from '@osumi/angular-tools';
import ConfigService from '@services/config.service';
import EmpleadosService from '@services/empleados.service';
import GestionService from '@services/gestion.service';
import HeaderComponent from '@shared/components/header/header.component';
import EmployeeListFilterPipe from '@shared/pipes/employee-list-filter.pipe';
import { Rol, RolGroup, rolList } from '@shared/rol.class';

@Component({
  standalone: true,
  selector: 'otpv-gestion-empleados',
  templateUrl: './gestion-empleados.component.html',
  styleUrls: ['./gestion-empleados.component.scss'],
  imports: [
    NgClass,
    NgStyle,
    KeyValuePipe,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    EmployeeListFilterPipe,
    MatCard,
    MatCardContent,
    MatFormField,
    MatInput,
    MatButton,
    MatIcon,
    MatActionList,
    MatListItem,
    MatTabGroup,
    MatTab,
    MatCheckbox,
  ],
})
export default class GestionEmpleadosComponent implements OnInit {
  public es: EmpleadosService = inject(EmpleadosService);
  public config: ConfigService = inject(ConfigService);
  private dialog: DialogService = inject(DialogService);
  private gs: GestionService = inject(GestionService);
  private router: Router = inject(Router);

  search: string = '';
  @ViewChild('searchBox', { static: true }) searchBox: ElementRef;
  selectedTab: number = 0;
  start: boolean = true;
  canNewEmployees: boolean = false;
  canDeleteEmployees: boolean = false;
  canModifyEmployees: boolean = false;
  canChangeEmployeeRoles: boolean = false;
  canSeeStatistics: boolean = false;
  canSaveChanges: boolean = false;
  @ViewChild('empleadoTabs', { static: false })
  empleadoTabs: MatTabGroup;
  selectedEmpleado: Empleado = new Empleado();

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    nombre: new FormControl(null, Validators.required),
    hasPassword: new FormControl(false),
    password: new FormControl(null),
    confirmPassword: new FormControl(null),
    color: new FormControl(null),
  });
  originalValue: EmpleadoSaveInterface = null;

  list: {
    [key: string]: RolGroup;
  } = rolList;
  selectedRolList: boolean[] = [];

  ngOnInit(): void {
    if (!this.gs.empleado) {
      this.router.navigate(['/gestion']);
      return;
    }
    this.canNewEmployees = this.gs.empleado.hasRol(
      rolList.empleados.roles['crear'].id
    );
    this.canDeleteEmployees = this.gs.empleado.hasRol(
      rolList.empleados.roles['borrar'].id
    );
    this.canModifyEmployees = this.gs.empleado.hasRol(
      rolList.empleados.roles['modificar'].id
    );
    this.canChangeEmployeeRoles = this.gs.empleado.hasRol(
      rolList.empleados.roles['roles'].id
    );
    this.canSeeStatistics = this.gs.empleado.hasRol(
      rolList.empleados.roles['estadisticas'].id
    );
    for (const group in this.list) {
      for (const rol in this.list[group].roles) {
        this.selectedRolList[this.list[group].roles[rol].id] = false;
      }
    }
    setTimeout((): void => {
      this.searchBox.nativeElement.focus();
    }, 0);
  }

  selectEmpleado(empleado: Empleado): void {
    this.start = false;
    this.selectedEmpleado = empleado;
    this.updateSelectedRolList();
    this.form.patchValue(this.selectedEmpleado.toInterface(false));
    this.originalValue = this.form.getRawValue();
    this.empleadoTabs.realignInkBar();
    this.updateEnabledDisabled('edit');
  }

  newEmpleado(): void {
    this.start = false;
    this.selectedEmpleado = new Empleado();
    this.updateSelectedRolList();
    this.form.patchValue(this.selectedEmpleado.toInterface(false));
    this.originalValue = this.form.getRawValue();
    this.empleadoTabs.realignInkBar();
    this.updateEnabledDisabled('new');
  }

  updateEnabledDisabled(operation: string): void {
    this.form.get('nombre')?.enable();
    this.form.get('hasPassword')?.enable();
    this.form.get('password')?.enable();
    this.form.get('confirmPassword')?.enable();
    this.form.get('color')?.enable();
    this.canSaveChanges = true;
    if (
      (operation === 'new' && !this.canNewEmployees) ||
      (operation === 'edit' && !this.canModifyEmployees)
    ) {
      this.form.get('nombre')?.disable();
      this.form.get('hasPassword')?.disable();
      this.form.get('password')?.disable();
      this.form.get('confirmPassword')?.disable();
      this.form.get('color')?.disable();
      this.canSaveChanges = false;
    }
    if (this.canChangeEmployeeRoles) {
      this.canSaveChanges = true;
    }
  }

  resetForm(): void {
    this.form.reset();
    this.form.patchValue(this.selectedEmpleado.toInterface(false));
    this.updateSelectedRolList();
  }

  updateSelectedRolList(): void {
    for (const i in this.selectedRolList) {
      this.selectedRolList[i] = false;
    }
    for (const i of this.selectedEmpleado.roles) {
      this.selectedRolList[i] = true;
    }
  }

  onSubmit(): void {
    if (
      this.form.value.hasPassword &&
      !this.originalValue.hasPassword &&
      (this.form.value.password === null ||
        this.form.value.password === '' ||
        this.form.value.confirmPassword === null ||
        this.form.value.password === '')
    ) {
      this.dialog.alert({
        title: 'Error',
        content:
          'El empleado "' +
          this.form.value.nombre +
          '" originalmente no tenía contraseña pero ahora has indicado que si debe tener, de modo que no puedes dejar la contraseña en blanco.',
      });
      return;
    }

    if (
      this.form.value.hasPassword &&
      this.form.value.password !== this.form.value.confirmPassword
    ) {
      this.dialog.alert({
        title: 'Error',
        content: 'Las contraseñas introducidas no coinciden.',
      });
      return;
    }

    const roles: number[] = [];
    for (const i in this.selectedRolList) {
      if (this.selectedRolList[i] === true) {
        roles.push(parseInt(i));
      }
    }
    const data: EmpleadoSaveInterface = JSON.parse(
      JSON.stringify(this.form.value)
    );
    data.roles = roles;

    this.selectedEmpleado.fromInterface(data, false);
    this.es.saveEmpleado(data).subscribe((result: StatusResult): void => {
      if (result.status === 'ok') {
        this.es.resetEmpleados();
        this.resetForm();
        this.dialog.alert({
          title: 'Datos guardados',
          content:
            'Los datos del empleado "' +
            this.selectedEmpleado.nombre +
            '" han sido correctamente guardados.',
        });
      } else {
        this.dialog.alert({
          title: 'Datos guardados',
          content: 'Ocurrió un error al guardar los datos del empleado.',
        });
      }
    });
  }

  deleteEmpleado(): void {
    this.dialog
      .confirm({
        title: 'Confirmar',
        content:
          '¿Estás seguro de querer borrar el empleado "' +
          this.selectedEmpleado.nombre +
          '"? Las ventas asociadas al empleado no se borrarán, pero dejarán de estar vinculadas a un empleado concreto.',
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.confirmDeleteEmpleado();
        }
      });
  }

  confirmDeleteEmpleado(): void {
    this.es
      .deleteEmpleado(this.selectedEmpleado.id)
      .subscribe((result: StatusResult): void => {
        if (result.status === 'ok') {
          this.es.resetEmpleados();
          this.start = true;
          this.dialog.alert({
            title: 'Empleado borrado',
            content:
              'El empleado "' +
              this.selectedEmpleado.nombre +
              '" ha sido correctamente borrado.',
          });
        } else {
          this.dialog.alert({
            title: 'Error',
            content: 'Ocurrió un error al borrar el empleado.',
          });
        }
      });
  }

  originalRolGroupOrder = (
    a: KeyValue<string, RolGroup>,
    b: KeyValue<string, RolGroup>
  ): number => {
    return 0;
  };

  originalRolOrder = (
    a: KeyValue<string, Rol>,
    b: KeyValue<string, Rol>
  ): number => {
    return 0;
  };
}
