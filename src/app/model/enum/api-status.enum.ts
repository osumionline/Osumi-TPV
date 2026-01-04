const ApiStatusEnum = {
  OK: 'ok',
  OK_TBAI_ERROR: 'ok-tbai-error',
  OK_EMAIL_ERROR: 'ok-email-error',
  ERROR: 'error',
  ERROR_NOMBRE: 'error-nombre',
  ERROR_FACTURA: 'error-factura',
  ERROR_FACTURADA: 'error-facturada',
  NEW: 'new',
  INSTALL: 'install',
  LOADED: 'loaded',
  NOMBRE_USED: 'nombre-used',
  REFERENCIA_USED: 'referencia-used',
  CB_USED: 'cb-used',
  CLIENTE: 'cliente',
  FACTURA: 'factura',
  RESERVA: 'reserva',
  CANCELAR: 'cancelar',
  FIN_RESERVA: 'fin-reserva',
  FIN: 'fin',
} as const;

export default ApiStatusEnum;
