import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { tap } from "rxjs";
import { ConfigService } from "src/app/services/config.service";

export const isOpenedGuardFn: CanActivateFn = () => {
  const router: Router = inject(Router);
  const config: ConfigService = inject(ConfigService);

  if (config.status === "install") {
    router.navigate(["/gestion/installation"]);
  }
  return inject(ConfigService)
    .isBoxOpened()
    .pipe(
      tap((isBoxOpened: boolean) => !isBoxOpened && router.navigate(["/"]))
    );
};
