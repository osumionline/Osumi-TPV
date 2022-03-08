import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { ApiService }        from 'src/app/services/api.service';
import { ConfigService }     from 'src/app/services/config.service';

@Component({
	selector: 'otpv-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
	title: string = '';
	loading: boolean = true;
	isOpened: boolean = false;

	constructor(
		private as: ApiService,
		private config: ConfigService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.config.start().then((status) => {
			if (status === 'install') {
				this.router.navigate(['/installation']);
			}
			if (status === 'loaded') {
				this.title = this.config.nombre;
				this.isOpened = this.config.isOpened;
				if (this.isOpened) {
					this.router.navigate(['/ventas']);
				}
				this.loading = false;
			}
		});
	}

	openBox(): void {
		this.as.openBox().subscribe(result => {
			this.isOpened = true;
			this.config.isOpened = true;
			this.router.navigate(['/ventas']);
		});
	}
}
