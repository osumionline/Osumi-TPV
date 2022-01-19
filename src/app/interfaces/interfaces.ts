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
}

export interface AppDataInterface {
	tipoIva: string;
	ivaList: number[];
	marginList: number[];
	ventaOnline: boolean;
	fechaCad: boolean;
}

export interface TarjetaInterface {
	id: number;
	nombre: string;
	slug: string;
	comision: number;
	porDefecto: boolean;
}

export interface StartDataInterface {
	status: string;
	opened: boolean;
	appData: AppDataInterface;
	tarjetas: TarjetaInterface[];
}

export interface StatusResult {
	status: string;
}

export interface MarcaInterface {
	id: number;
	nombre: string;
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

export interface CodigoBarrasInterface {
	id: number;
	codigoBarras: number;
	porDefecto: boolean;
}

export interface ArticuloInterface {
	id: number;
	localizador: number;
	nombre: string;
	idCategoria: number;
	idMarca: number;
	idProveedor: number;
	referencia: string;
	puc: number;
	pvp: number;
	palb: number;
	iva: number;
	re: number;
	margen: number;
	stock: number;
	stockMin: number;
	stockMax: number;
	loteOptimo: number;
	ventaOnline: boolean;
	mostrarFecCad: boolean;
	fechaCaducidad: string;
	observaciones: string;
	mostrarObsPedidos: boolean;
	mostrarObsVentas: boolean;
	mostrarEnWeb: boolean;
	descCorta: string;
	descripcion: string;
	codigosBarras: CodigoBarrasInterface[];
	fotos: number[];
	activo: boolean;
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
	stock: number;
	cantidad: number;
	pvp: number;
	importe: number;
	descuento: number;
}

export interface VentaInterface {
	lineas: LineaVentaInterface[];
	importe: number;
}
