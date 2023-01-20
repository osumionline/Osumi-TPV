import { Component, OnInit } from "@angular/core";

@Component({
  selector: "otpv-informe-mensual",
  templateUrl: "./informe-mensual.component.html",
  styleUrls: ["./informe-mensual.component.scss"],
})
export class InformeMensualComponent implements OnInit {
  constructor() {
    document.body.classList.add("white-bg");
  }

  ngOnInit(): void {}
}
