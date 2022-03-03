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

export interface AppDataInterface {
	nombre: string;
	cif: string;
	telefono: string;
	direccion: string;
	email: string;
	pass: string;
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
	slug: string;
	afectaCaja: boolean;
	orden: number;
}

export interface StartDataInterface {
	status: string;
	opened: boolean;
	appData: AppDataInterface;
	tiposPago: TipoPagoInterface[];
}

export interface StatusResult {
	status: string;
}

export interface MarcaInterface {
	id: number;
	nombre: string;
	direccion: string;
	idFoto: number;
	telefono: string;
	email: string;
	web: string;
	observaciones: string;
}

export interface MarcasResult {
	list: MarcaInterface[];
}

export interface IdSaveResult {
	status: string;
	id: number;
}

export interface ProveedorInterface {
	id: number;
	nombre: string;
	idFoto: number;
	direccion: string;
	telefono: string;
	email: string;
	web: string;
	observaciones: string;
	marcas: number[];
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

export interface Tabs {
	selected: number;
	names: string[];
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
	observaciones: string;
}

export interface VentaInterface {
	lineas: LineaVentaInterface[];
	importe: number;
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
	factProvincia: string;
	observaciones: string;
}

export interface SearchClientesResult {
	status: string;
	list: ClienteInterface[];
}

export interface ClienteSaveResult {
	status: string;
	id: number;
}