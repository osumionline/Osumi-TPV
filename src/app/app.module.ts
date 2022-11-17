import { HttpClientModule } from "@angular/common/http";
import { APP_INITIALIZER, LOCALE_ID, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { MatSortModule } from "@angular/material/sort";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxBarcode6Module } from "ngx-barcode6";
import { AppRoutingModule } from "src/app/app-routing.module";
import { AppComponent } from "src/app/app.component";
import { ConfigService } from "src/app/services/config.service";

import { registerLocaleData } from "@angular/common";
import es from "@angular/common/locales/es";

registerLocaleData(es);

import { COMPONENTS, MATERIAL, PAGES, PIPES, SERVICES } from "./app.common";
import { HistoricoVentasComponent } from './components/historico-ventas/historico-ventas.component';

export function servicesOnRun(config: ConfigService) {
  return (): Promise<string> => config.start();
}

@NgModule({
  declarations: [AppComponent, ...PAGES, ...COMPONENTS, ...PIPES, HistoricoVentasComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSortModule,
    NgxBarcode6Module,
    ...MATERIAL,
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
