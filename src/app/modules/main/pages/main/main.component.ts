import { Component, OnInit } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatCard, MatCardContent } from "@angular/material/card";
import { Router } from "@angular/router";
import { StatusResult } from "src/app/interfaces/interfaces";
import { HeaderComponent } from "src/app/modules/shared/components/header/header.component";
import { ApiService } from "src/app/services/api.service";
import { ConfigService } from "src/app/services/config.service";

@Component({
  standalone: true,
  selector: "otpv-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
  imports: [HeaderComponent, MatCard, MatCardContent, MatButton],
})
export default class MainComponent implements OnInit {
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
    this.as.openBox().subscribe((result: StatusResult): void => {
      if (result.status === "ok") {
        this.isOpened = true;
        this.config.isOpened = true;
        this.router.navigate(["/ventas"]);
      }
    });
  }
}
