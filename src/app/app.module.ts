import { BrowserModule }           from '@angular/platform-browser';
import { NgModule }                from '@angular/core';
import { ServiceWorkerModule }     from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule }        from '@angular/common/http';
import { FormsModule }             from '@angular/forms';
import { AppRoutingModule }        from './app-routing.module';
import { AppComponent }            from './app.component';
import { environment }             from '../environments/environment';

import { PAGES, COMPONENTS, PIPES, SERVICES, MATERIAL } from './app.common';

import { ConfirmDialogComponent } from './components/dialogs/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent }   from './components/dialogs/alert-dialog/alert-dialog.component';
import { FormDialogComponent }    from './components/dialogs/form-dialog/form-dialog.component';

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
    BrowserAnimationsModule,
    ...MATERIAL
  ],
  entryComponents: [ConfirmDialogComponent, AlertDialogComponent, FormDialogComponent],
  providers: [
    ...SERVICES
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}