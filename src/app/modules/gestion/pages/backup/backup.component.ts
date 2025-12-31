import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatList, MatListItem } from '@angular/material/list';
import { BackupResult, StatusResult } from '@interfaces/interfaces';
import Backup from '@model/tpv/backup.model';
import { DialogService } from '@osumi/angular-tools';
import ClassMapperService from '@services/class-mapper.service';
import ConfigService from '@services/config.service';
import GestionService from '@services/gestion.service';
import HeaderComponent from '@shared/components/header/header.component';

@Component({
  selector: 'otpv-backup',
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.scss'],
  imports: [HeaderComponent, MatCard, MatCardContent, MatButton, MatList, MatListItem],
})
export default class BackupComponent implements OnInit {
  private config: ConfigService = inject(ConfigService);
  private gs: GestionService = inject(GestionService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private dialog: DialogService = inject(DialogService);

  backups: Backup[] = [];

  ngOnInit(): void {
    this.loadBackups();
  }

  loadBackups(): void {
    this.gs.getBackups(this.config.backupApiKey).subscribe((result: BackupResult): void => {
      this.backups = this.cms.getBackups(result.list);
    });
  }

  newBackup(): void {
    this.gs.newBackup().subscribe((result: StatusResult): void => {
      if (result.status === 'ok') {
        this.dialog
          .alert({
            title: 'Nueva copia de seguridad',
            content: 'La nueva copia de seguridad ha sido correctamente creada.',
          })
          .subscribe((): void => {
            this.loadBackups();
          });
      } else {
        this.dialog.alert({
          title: 'Error',
          content: 'Ha ocurrido un error al crear la nueva copia de seguridad.',
        });
      }
    });
  }

  deleteBackup(backup: Backup): void {
    this.dialog
      .confirm({
        title: 'Confirmar',
        content:
          '¿Estás seguro de querer borrar esta copia de seguridad? Es un proceso irreversible y se perderán los datos guardados.',
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.confirmDeleteBackup(backup);
        }
      });
  }

  confirmDeleteBackup(backup: Backup): void {
    this.gs
      .deleteBackup(this.config.backupApiKey, backup.id as number)
      .subscribe((result: StatusResult): void => {
        if (result.status === 'ok') {
          this.dialog
            .alert({
              title: 'Copia borrada',
              content: 'La copia de seguridad ha sido correctamente eliminada.',
            })
            .subscribe((): void => {
              this.loadBackups();
            });
        } else {
          this.dialog.alert({
            title: 'Error',
            content: 'Ha ocurrido un error al borrar la copia de seguridad.',
          });
        }
      });
  }

  loadBackup(backup: Backup): void {
    this.dialog
      .confirm({
        title: 'Confirmar',
        content:
          '¿Estás seguro de querer cargar esta copia de seguridad? Es un proceso irreversible y se perderán los datos que hay actualmente en la base de datos.',
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          console.log(backup);
        }
      });
  }
}
