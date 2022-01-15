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

export interface AppData {
	tipoIva: string;
	ivaList: number[];
	marginList: number[];
	ventaOnline: boolean;
	fechaCad: boolean;
}

export interface StartDataResult {
	status: string;
	opened: boolean;
	appData: AppData;
}

export interface StatusResult {
	status: string;
}

export interface Marca {
	id: number;
	nombre: string;
	telefono: string;
	email: string;
	web: string;
	observaciones: string;
}

export interface MarcasResult {
	list: Marca[];
}

export interface IdSaveResult {
	status: string;
	id: number;
}

export interface Proveedor {
	id: number;
	nombre: string;
	direccion: string;
	telefono: string;
	email: string;
	web: string;
	observaciones: string;
	marcas: number[];
}

export interface ProveedoresResult {
	list: Proveedor[];
}

export interface Categoria {
	id: number;
	nombre: string;
	profundidad: number;
	hijos: Categoria[];
}

export interface CategoriasResult {
	list: Categoria;
}

export interface CodigoBarras {
	id: number;
	codigoBarras: number;
	porDefecto: boolean;
}

export interface Articulo {
	id: number;
	localizador: number;
	nombre: string;
	puc: number;
	pvp: number;
	margen: number;
	palb: number;
	idMarca: number;
	idProveedor: number;
	stock: number;
	stockMin: number;
	stockMax: number;
	loteOptimo: number;
	iva: number;
	fechaCaducidad: string;
	mostrarFecCad: boolean;
	observaciones: string;
	mostrarObsPedidos: boolean;
	mostrarObsVentas: boolean;
	referencia: string;
	ventaOnline: boolean;
	mostrarEnWeb: boolean;
	idCategoria: number;
	descCorta: string;
	desc: string;
	codigosBarras: CodigoBarras[];
	activo: boolean;
}

export interface ArticuloSaveResult {
	status: string;
	localizador: number;
}

export interface ArticuloResult {
	status: string;
	articulo: Articulo;
}

export interface Tabs {
	selected: number;
	names: string[];
}

export interface LineaVenta {
	idArticulo: number;
	localizador: number;
	descripcion: string;
	stock: number;
	cantidad: number;
	pvp: number;
	importe: number;
}

export interface Venta {
	lineas: LineaVenta[];
	importe: number;
}
