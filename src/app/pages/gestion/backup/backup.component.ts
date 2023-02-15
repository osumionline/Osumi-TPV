import { Component, OnInit } from "@angular/core";
import { Backup } from "src/app/model/tpv/backup.model";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { ConfigService } from "src/app/services/config.service";
import { DialogService } from "src/app/services/dialog.service";
import { GestionService } from "src/app/services/gestion.service";

@Component({
  selector: "otpv-backup",
  templateUrl: "./backup.component.html",
  styleUrls: ["./backup.component.scss"],
})
export class BackupComponent implements OnInit {
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
    this.gs.getBackups(this.config.backupApiKey).subscribe((result) => {
      this.backups = this.cms.getBackups(result.list);
    });
  }

  newBackup(): void {
    this.gs.newBackup().subscribe((result) => {
      console.log(result);
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
      .subscribe((result) => {
        if (result === true) {
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
      .subscribe((result) => {
        if (result === true) {
        }
      });
  }
}
