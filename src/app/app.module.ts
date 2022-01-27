import { BrowserModule }           from '@angular/platform-browser';
import { NgModule, LOCALE_ID }     from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule }        from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_DATE_LOCALE }         from '@angular/material/core';
import { AppRoutingModule }        from './app-routing.module';
import { AppComponent }            from './app.component';
import { NgxBarcode6Module }       from 'ngx-barcode6';

import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

registerLocaleData(es);

import { PAGES, COMPONENTS, PIPES, SERVICES, MATERIAL } from './app.common';

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
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		NgxBarcode6Module,
		...MATERIAL
	],
	providers: [
		{
			provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
			useValue: appearance
		},
		{
			provide: MAT_DATE_LOCALE, useValue: 'es'
		},
		{
			provide: LOCALE_ID, useValue: 'es-ES'
		},
		...SERVICES
	],
	bootstrap: [AppComponent]
})
export class AppModule {}