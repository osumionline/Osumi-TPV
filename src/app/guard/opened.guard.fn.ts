import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ConfigService } from "src/app/services/config.service";

export const isOpenedGuardFn: CanActivateFn = (): Observable<boolean> => {
  const router = inject(Router);
  const config: ConfigService = inject(ConfigService);

  if (config.status === "install") {
    router.navigate(["/gestion/installation"]);
  }
  return inject(ConfigService)
    .isBoxOpened()
    .pipe(
      map((isBoxOpened: boolean) => {
        if (!isBoxOpened) {
          router.navigate(["/"]);
        }
        return isBoxOpened;
      })
    );
};
