import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { ConfigService } from "@services/config.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export const isOpenedGuardFn: CanActivateFn = (): Observable<boolean> => {
  const router = inject(Router);
  const config: ConfigService = inject(ConfigService);

  if (config.status === "install") {
    router.navigate(["/gestion/installation"]);
  }
  return inject(ConfigService)
    .isBoxOpened()
    .pipe(
      map((isBoxOpened: boolean): boolean => {
        if (!isBoxOpened) {
          router.navigate(["/"]);
        }
        return isBoxOpened;
      })
    );
};
