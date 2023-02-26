import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MaterialModule } from "src/app/modules/material/material.module";
import { HeaderComponent } from "src/app/modules/shared/components/header/header.component";
import { ApiService } from "src/app/services/api.service";
import { ConfigService } from "src/app/services/config.service";

@Component({
  standalone: true,
  selector: "otpv-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
  imports: [MaterialModule, HeaderComponent],
})
export class MainComponent implements OnInit {
  title: string = "";
  loading: boolean = true;
  isOpened: boolean = false;

  constructor(
    private as: ApiService,
    private config: ConfigService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.config.status === "install") {
      this.router.navigate(["/gestion/installation"]);
    }
    if (this.config.status === "loaded") {
      this.title = this.config.nombre;
      this.isOpened = this.config.isOpened;
      if (this.isOpened) {
        this.router.navigate(["/ventas"]);
      }
      this.loading = false;
    }
  }

  openBox(): void {
    this.as.openBox().subscribe((result) => {
      this.isOpened = true;
      this.config.isOpened = true;
      this.router.navigate(["/ventas"]);
    });
  }
}
