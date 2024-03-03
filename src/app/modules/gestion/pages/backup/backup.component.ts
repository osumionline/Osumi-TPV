import { Component, OnInit } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatCard, MatCardContent } from "@angular/material/card";
import { MatList, MatListItem } from "@angular/material/list";
import { BackupResult, StatusResult } from "src/app/interfaces/interfaces";
import { Backup } from "src/app/model/tpv/backup.model";
import { HeaderComponent } from "src/app/modules/shared/components/header/header.component";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ConfigService } from "src/app/services/config.service";
import { DialogService } from "src/app/services/dialog.service";
import { GestionService } from "src/app/services/gestion.service";

@Component({
  standalone: true,
  selector: "otpv-backup",
  templateUrl: "./backup.component.html",
  styleUrls: ["./backup.component.scss"],
  imports: [
    HeaderComponent,
    MatCard,
    MatCardContent,
    MatButton,
    MatList,
    MatListItem,
  ],
})
export default class BackupComponent implements OnInit {
  backups: Backup[] = [];

  constructor(
    private config: ConfigService,
    private gs: GestionService,
    private cms: ClassMapperService,
    private dialog: DialogService
  ) {}

  ngOnInit(): void {
    this.loadBackups();
  }

  loadBackups(): void {
    this.gs
      .getBackups(this.config.backupApiKey)
      .subscribe((result: BackupResult): void => {
        this.backups = this.cms.getBackups(result.list);
      });
  }

  newBackup(): void {
    this.gs.newBackup().subscribe((result: StatusResult): void => {
      if (result.status === "ok") {
        this.dialog
          .alert({
            title: "Nueva copia de seguridad",
            content:
              "La nueva copia de seguridad ha sido correctamente creada.",
            ok: "Continuar",
          })
          .subscribe((): void => {
            this.loadBackups();
          });
      } else {
        this.dialog.alert({
          title: "Error",
          content: "Ha ocurrido un error al crear la nueva copia de seguridad.",
          ok: "Continuar",
        });
      }
    });
  }

  deleteBackup(backup: Backup): void {
    this.dialog
      .confirm({
        title: "Confirmar",
        content:
          "¿Estás seguro de querer borrar esta copia de seguridad? Es un proceso irreversible y se perderán los datos guardados.",
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.confirmDeleteBackup(backup);
        }
      });
  }

  confirmDeleteBackup(backup: Backup): void {
    this.gs
      .deleteBackup(this.config.backupApiKey, backup.id)
      .subscribe((result: StatusResult): void => {
        if (result.status === "ok") {
          this.dialog
            .alert({
              title: "Copia borrada",
              content: "La copia de seguridad ha sido correctamente eliminada.",
              ok: "Continuar",
            })
            .subscribe((): void => {
              this.loadBackups();
            });
        } else {
          this.dialog.alert({
            title: "Error",
            content: "Ha ocurrido un error al borrar la copia de seguridad.",
            ok: "Continuar",
          });
        }
      });
  }

  loadBackup(backup: Backup): void {
    this.dialog
      .confirm({
        title: "Confirmar",
        content:
          "¿Estás seguro de querer cargar esta copia de seguridad? Es un proceso irreversible y se perderán los datos que hay actualmente en la base de datos.",
        ok: "Continuar",
        cancel: "Cancelar",
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
        }
      });
  }
}
