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

export interface Month {
  id: number;
  name: string;
  days: number;
}

export interface ProvinceInterface {
  id: number;
  name: string;
}

export interface CCAAInterface {
  name: string;
  provinces: ProvinceInterface[];
}

export interface AllProvincesInterface {
  ccaa: CCAAInterface[];
}

export interface IvaReOptionInterface {
  id: string;
  name: string;
}

export interface IvaOptionInterface {
  option: number;
  selected: boolean;
}

export interface MarginOptionInterface {
  value: number;
  checked: boolean;
}

export interface AppDataInterface {
  nombre: string;
  cif: string;
  telefono: string;
  direccion: string;
  email: string;
  logo: string;
  nombreEmpleado: string;
  pass: string;
  color: string;
  twitter: string;
  facebook: string;
  instagram: string;
  web: string;
  tipoIva: string;
  ivaList: number[];
  reList: number[];
  marginList: number[];
  ventaOnline: boolean;
  urlApi: string;
  fechaCad: boolean;
  empleados: boolean;
}

export interface AppDataResult {
  nombre: string;
  cif: string;
  telefono: string;
  email: string;
  direccion: string;
  twitter: string;
  facebook: string;
  instagram: string;
  web: string;
  tipoIva: string;
  ivaList: number[];
  reList: number[];
  marginList: number[];
  ventaOnline: boolean;
  urlApi: string;
  fechaCad: boolean;
  empleados: boolean;
}

export interface TipoPagoInterface {
  id: number;
  nombre: string;
  foto: string;
  afectaCaja: boolean;
  orden: number;
  fisico: boolean;
}

export interface TiposPagoResult {
  list: TipoPagoInterface[];
}

export interface TiposPagoOrderInterface {
  id: number;
  orden: number;
}

export interface StartDataInterface {
  status: string;
  opened: boolean;
  appData: AppDataResult;
  tiposPago: TipoPagoInterface[];
}

export interface StatusResult {
  status: string;
}

export interface MarcaInterface {
  id: number;
  nombre: string;
  direccion: string;
  foto: string;
  telefono: string;
  email: string;
  web: string;
  observaciones: string;
  crearProveedor?: boolean;
}

export interface MarcasResult {
  list: MarcaInterface[];
}

export interface SelectMarcaInterface {
  id: number;
  nombre: string;
  selected: boolean;
}

export interface IdSaveResult {
  status: string;
  id: number;
}

export interface ComercialInterface {
  id: number;
  idProveedor: number;
  nombre: string;
  telefono: string;
  email: string;
  observaciones: string;
}

export interface ProveedorInterface {
  id: number;
  nombre: string;
  foto: string;
  direccion: string;
  telefono: string;
  email: string;
  web: string;
  observaciones: string;
  marcas: number[];
  comerciales: ComercialInterface[];
}

export interface ProveedoresResult {
  list: ProveedorInterface[];
}

export interface CategoriaInterface {
  id: number;
  nombre: string;
  profundidad: number;
  hijos: CategoriaInterface[];
}

export interface CategoriasResult {
  list: CategoriaInterface;
}

export interface ChartSelectInterface {
  data: string;
  type: string;
  month: number;
  year: number;
}

export interface ChartSeriesInterface {
  name: string;
  value: number;
}

export interface ChartDataInterface {
  name: string;
  series: ChartSeriesInterface[];
}

export interface ChartResultInterface {
  status: string;
  data: ChartDataInterface[];
}

export interface CodigoBarrasInterface {
  id: number;
  codigoBarras: number;
  porDefecto: boolean;
}

export interface FotoInterface {
  status: string;
  id: number;
  data: string;
}

export interface ArticuloInterface {
  id: number;
  localizador: number;
  nombre: string;
  idCategoria: number;
  idMarca: number;
  idProveedor: number;
  referencia: string;
  palb: number;
  puc: number;
  pvp: number;
  iva: number;
  re: number;
  margen: number;
  stock: number;
  stockMin: number;
  stockMax: number;
  loteOptimo: number;
  ventaOnline: boolean;
  fechaCaducidad: string;
  mostrarEnWeb: boolean;
  descCorta: string;
  descripcion: string;
  observaciones: string;
  mostrarObsPedidos: boolean;
  mostrarObsVentas: boolean;
  accesoDirecto: number;
  codigosBarras: CodigoBarrasInterface[];
  fotos: number[];
  fotosList?: FotoInterface[];
}

export interface ArticuloSaveResult {
  status: string;
  localizador: number;
}

export interface ArticuloResult {
  status: string;
  articulo: ArticuloInterface;
}

export interface SearchArticulosResult {
  status: string;
  list: ArticuloInterface[];
}

export interface ArticuloBuscadorInterface {
  localizador: number;
  nombre: string;
  marca: string;
  pvp: number;
  stock: number;
}

export interface ArticuloBuscadorResult {
  status: string;
  list: ArticuloBuscadorInterface[];
}

export interface AccesoDirectoInterface {
  id: number;
  accesoDirecto: number;
  nombre: string;
}

export interface AccesoDirectoResult {
  list: AccesoDirectoInterface[];
}

export interface LineaVentaInterface {
  idArticulo: number;
  localizador: number;
  descripcion: string;
  marca: string;
  stock: number;
  cantidad: number;
  pvp: number;
  importe: number;
  descuento: number;
  descuentoManual: boolean;
  observaciones: string;
}

export interface VentaInterface {
  idEmpleado: number;
  lineas: LineaVentaInterface[];
  importe: number;
}

export interface FinVentaInterface {
  efectivo: number;
  cambio: number;
  tarjeta: number;
  idEmpleado: number;
  idTipoPago: number;
  idCliente: number;
  total: number;
  lineas: LineaVentaInterface[];
  pagoMixto: boolean;
  factura: boolean;
}

export interface FinVentaResult {
  status: string;
  id: number;
  importe: number;
  cambio: number;
}

export interface FacturaResult {
  status: string;
  factura: FinVentaInterface;
}

export interface ClienteInterface {
  id: number;
  nombreApellidos: string;
  dniCif: string;
  telefono: string;
  email: string;
  direccion: string;
  codigoPostal: string;
  poblacion: string;
  provincia: number;
  factIgual: boolean;
  factNombreApellidos: string;
  factDniCif: string;
  factTelefono: string;
  factEmail: string;
  factDireccion: string;
  factCodigoPostal: string;
  factPoblacion: string;
  factProvincia: number;
  observaciones: string;
  ultimaVenta: string;
}

export interface ClientesResult {
  status: string;
  list: ClienteInterface[];
}

export interface ClienteSaveResult {
  status: string;
  id: number;
}

export interface UltimaVentaArticuloInterface {
  fecha: string;
  localizador: number;
  nombre: string;
  unidades: number;
  pvp: number;
  importe: number;
}

export interface TopVentaArticuloInterface {
  localizador: number;
  nombre: string;
  importe: number;
}

export interface EstadisticasClienteResult {
  status: string;
  ultimasVentas: UltimaVentaArticuloInterface[];
  topVentas: TopVentaArticuloInterface[];
}

export interface EmpleadoInterface {
  id: number;
  nombre: string;
  hasPassword: boolean;
  color: string;
  roles: number[];
}

export interface EmpleadoLoginInterface {
  id: number;
  pass: string;
}

export interface EmpleadosResult {
  list: EmpleadoInterface[];
}

export interface EmpleadoSaveInterface {
  id: number;
  nombre: string;
  hasPassword: boolean;
  password: string;
  confirmPassword: string;
  color: string;
  roles: number[];
}

export interface ColorValues {
  r: number;
  g: number;
  b: number;
}

export interface DateValues {
  modo: string;
  fecha: string;
  desde: string;
  hasta: string;
}

export interface HistoricoLineaVentaInterface {
  id: number;
  idArticulo: number;
  articulo: string;
  localizador: number;
  marca: string;
  puc: number;
  pvp: number;
  iva: number;
  re: number;
  importe: number;
  descuento: number;
  importeDescuento: number;
  devuelto: number;
  unidades: number;
}

export interface HistoricoVentaInterface {
  id: number;
  editable: boolean;
  idEmpleado: number;
  idCliente: number;
  cliente: string;
  total: number;
  entregado: number;
  pagoMixto: boolean;
  idTipoPago: number;
  nombreTipoPago: string;
  entregadoOtro: number;
  saldo: number;
  fecha: string;
  lineas: HistoricoLineaVentaInterface[];
}

export interface HistoricoVentasResult {
  status: string;
  list: HistoricoVentaInterface[];
}

export interface SalidaCajaInterface {
  id: number;
  concepto: string;
  descripcion: string;
  importe: number;
  fecha: string;
}

export interface SalidaCajaResult {
  status: string;
  list: SalidaCajaInterface[];
}
