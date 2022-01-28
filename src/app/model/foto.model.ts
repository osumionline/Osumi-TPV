import { environment } from 'src/environments/environment';
import { FotoInterface } from 'src/app/interfaces/interfaces';

export class Foto {
	status: string = 'new';
	data: string = null;
	url: string = null;

	constructor(public id: number = null) {
		if (id !== null) {
			this.status = 'ok';
			this.url = environment.fotosUrl + id + '.webp';
		}
	}

	load(str: string): void {
		this.status = 'new';
		this.data = str;
	}

	toInterface(): FotoInterface {
		return {
			status: this.status,
			id: this.id,
			data: this.data
		}
	}
}