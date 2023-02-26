import { HttpClientModule } from "@angular/common/http";
import { APP_INITIALIZER, LOCALE_ID, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { MatSortModule } from "@angular/material/sort";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { QRCodeModule } from "angularx-qrcode";
import { AppRoutingModule } from "src/app/app-routing.module";
import { AppComponent } from "src/app/app.component";
import { ConfigService } from "src/app/services/config.service";

import { registerLocaleData } from "@angular/common";
import es from "@angular/common/locales/es";

import { MaterialModule } from "./modules/material/material.module";

registerLocaleData(es);

import { COMPONENTS, PAGES, PIPES, SERVICES } from "./app.common";

import { VentasModule } from "./modules/ventas/ventas.module";

import { EmployeeLoginComponent } from "src/app/modules/shared/components/employee-login/employee-login.component";
import { HeaderComponent } from "src/app/modules/shared/components/header/header.component";

import { CajaContentComponent } from "src/app/modules/shared/components/caja/caja-content/caja-content.component";
import { CierreCajaComponent } from "src/app/modules/shared/components/caja/cierre-caja/cierre-caja.component";
import { HistoricoVentasComponent } from "src/app/modules/shared/components/caja/historico-ventas/historico-ventas.component";
import { SalidasCajaComponent } from "src/app/modules/shared/components/caja/salidas-caja/salidas-caja.component";

import { FixedNumberPipe } from "src/app/modules/shared/pipes/fixed-number.pipe";

export function servicesOnRun(config: ConfigService) {
  return (): Promise<string> => config.start();
}

@NgModule({
  declarations: [AppComponent, ...PAGES, ...COMPONENTS, ...PIPES],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSortModule,
    QRCodeModule,
    MaterialModule,
    VentasModule,
    HeaderComponent,
    EmployeeLoginComponent,
    HistoricoVentasComponent,
    SalidasCajaComponent,
    CierreCajaComponent,
    CajaContentComponent,
    FixedNumberPipe,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: "outline" },
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: "es",
    },
    {
      provide: LOCALE_ID,
      useValue: "es-ES",
    },
    ...SERVICES,
    {
      provide: APP_INITIALIZER,
      useFactory: servicesOnRun,
      multi: true,
      deps: [ConfigService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
