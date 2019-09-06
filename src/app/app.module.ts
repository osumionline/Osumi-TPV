import { BrowserModule }           from '@angular/platform-browser';
import { NgModule }                from '@angular/core';
import { ServiceWorkerModule }     from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule }        from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_DATE_LOCALE }         from '@angular/material/core';
import { AppRoutingModule }        from './app-routing.module';
import { AppComponent }            from './app.component';
import { environment }             from '../environments/environment';
import { NgxBarcode6Module }       from 'ngx-barcode6';

import { PAGES, COMPONENTS, PIPES, SERVICES, MATERIAL } from './app.common';

import { ConfirmDialogComponent } from './components/dialogs/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent }   from './components/dialogs/alert-dialog/alert-dialog.component';
import { FormDialogComponent }    from './components/dialogs/form-dialog/form-dialog.component';

const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline'
};

@NgModule({
  declarations: [
    AppComponent,
    ...PAGES,
    ...COMPONENTS,
    ...PIPES
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxBarcode6Module,
    ...MATERIAL
  ],
  entryComponents: [ConfirmDialogComponent, AlertDialogComponent, FormDialogComponent],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: appearance
    },
    {provide: MAT_DATE_LOCALE, useValue: 'es'},
    ...SERVICES
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}