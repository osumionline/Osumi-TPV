import { CodigoBarrasInterface } from 'src/app/interfaces/interfaces';

export class CodigoBarras {
	constructor(
		public id: number = -1,
		public codigoBarras: number = -1,
		public porDefecto: boolean = false
	) {}

	fromInterface(cb: CodigoBarrasInterface): CodigoBarras {
		this.id = cb.id;
		this.codigoBarras = cb.codigoBarras;
		this.porDefecto = cb.porDefecto;

		return this;
	}

	toInterface(): CodigoBarrasInterface {
		return {
			id: this.id,
			codigoBarras: this.codigoBarras,
			porDefecto: this.porDefecto
		};
	}
}
