import { HttpClientModule } from "@angular/common/http";
import { LOCALE_ID, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import {
  MatFormFieldDefaultOptions,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from "@angular/material/form-field";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxBarcode6Module } from "ngx-barcode6";
import { AppRoutingModule } from "src/app/app-routing.module";
import { AppComponent } from "src/app/app.component";

import { registerLocaleData } from "@angular/common";
import es from "@angular/common/locales/es";

registerLocaleData(es);

import { COMPONENTS, MATERIAL, PAGES, PIPES, SERVICES } from "./app.common";

const appearance: MatFormFieldDefaultOptions = {
  appearance: "outline",
};

@NgModule({
  declarations: [AppComponent, ...PAGES, ...COMPONENTS, ...PIPES],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxBarcode6Module,
    ...MATERIAL,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: appearance,
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
