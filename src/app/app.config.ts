import {
  ApplicationConfig,
  LOCALE_ID,
  inject,
  provideAppInitializer,
} from '@angular/core';
import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';

import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import es from '@angular/common/locales/es';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
} from '@angular/material/form-field';
import routes from '@app/app.routes';
import provideCore from '@modules/core';
import ConfigService from '@services/config.service';

registerLocaleData(es);

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};
const inMemoryScrollingFeature: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig);
const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline',
};

const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: appearance,
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'es',
    },
    {
      provide: LOCALE_ID,
      useValue: 'es-ES',
    },
    provideAppInitializer(() => inject(ConfigService).start()),
    provideRouter(
      routes,
      withViewTransitions(),
      inMemoryScrollingFeature,
      withComponentInputBinding()
    ),
    provideHttpClient(),
    provideCore(),
  ],
};

export default appConfig;
