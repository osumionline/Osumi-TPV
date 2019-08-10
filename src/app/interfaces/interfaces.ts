export interface DialogField {
  title: string;
  type: string;
  value: string;
  hint?: string;
}

export interface DialogOptions {
  title: string;
  content: string;
  fields?: DialogField[];
  ok: string;
  cancel?: string;
}

export interface AppData {
  ventaOnline: boolean;
  ivaList: number[];
}

export interface StartDataResult {
  status: string;
  opened: boolean;
  appData: AppData;
}