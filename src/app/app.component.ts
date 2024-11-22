import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'otpv-root',
  template: `<router-outlet />`,
  imports: [RouterModule],
})
export default class AppComponent {}
