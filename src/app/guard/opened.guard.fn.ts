import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import ApiStatusEnum from '@model/enum/api-status.enum';
import ConfigService from '@services/config.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const isOpenedGuardFn: CanActivateFn = (): Observable<boolean> => {
  const router = inject(Router);
  const config: ConfigService = inject(ConfigService);

  if (config.status === ApiStatusEnum.INSTALL) {
    router.navigate(['/gestion/installation']);
  }
  return inject(ConfigService)
    .isBoxOpened()
    .pipe(
      map((isBoxOpened: boolean): boolean => {
        if (!isBoxOpened) {
          router.navigate(['/']);
        }
        return isBoxOpened;
      })
    );
};

export default isOpenedGuardFn;
