import { NativeDateAdapter } from '@angular/material/core';

export default class CustomDateAdapter extends NativeDateAdapter {
  override getFirstDayOfWeek(): number {
    return 1;
  }
}
