import { environment } from 'src/environments/environment';
import { FotoInterface } from 'src/app/interfaces/interfaces';

export class Foto {
	status: string = 'new';
	data: string = null;

	constructor(public id: number = null) {
		if (id !== null) {
			this.status = 'ok';
		}
	}

	load(str: string): void {
		this.status = 'new';
		this.data = str;
	}

	get url(): string {
		if (this.status === 'ok') {
			return environment.fotosUrl + this.id + '.webp';
		}
		else {
			return this.data;
		}
	}

	toInterface(): FotoInterface {
		return {
			status: this.status,
			id: this.id,
			data: this.data
		}
	}
}
