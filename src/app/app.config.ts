import { APP_INITIALIZER, ApplicationConfig, LOCALE_ID } from "@angular/core";
import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  provideRouter,
  withInMemoryScrolling,
} from "@angular/router";

import { registerLocaleData } from "@angular/common";
import { provideHttpClient } from "@angular/common/http";
import es from "@angular/common/locales/es";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
} from "@angular/material/form-field";
import { provideAnimations } from "@angular/platform-browser/animations";
import { routes } from "src/app/app.routes";
import { provideCore } from "src/app/modules/core";
import { ConfigService } from "src/app/services/config.service";

registerLocaleData(es);

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: "top",
  anchorScrolling: "enabled",
};
const inMemoryScrollingFeature: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig);
const appearance: MatFormFieldDefaultOptions = {
  appearance: "outline",
};

export function servicesOnRun(config: ConfigService) {
  return (): Promise<string> => config.start();
}

export const appConfig: ApplicationConfig = {
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
    {
      provide: APP_INITIALIZER,
      useFactory: servicesOnRun,
      multi: true,
      deps: [ConfigService],
    },
    provideRouter(routes, inMemoryScrollingFeature),
    provideHttpClient(),
    provideCore(),
    provideAnimations(),
  ],
};
